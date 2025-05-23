/*
 * Copyright (c) 2018-2019, Arm Limited and affiliates.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * CC4485 DHCPv6 Solicit modified for Smart City Demo 
 * Version 2: Add in changed behavior if compiling for Border Router
 */
 

 #include "nsconfig.h"
 #include <string.h>
 #include <ns_types.h>
 #include <ns_trace.h>
 #include "nsdynmemLIB.h"
 #include "ns_list.h"
 #include "common_functions.h"
 
 #ifdef HAVE_DHCPV6
 #include "dhcp_service_api.h"
 #include "dhcpv6_client_api.h"
 #include "libDHCPv6/libDHCPv6.h"
 #include "NWK_INTERFACE/Include/protocol.h"

#if defined(FSR) || defined (LIGHT)
 #include "coap_service_api.h"
 #include "eventOS_event_timer.h"
 #include "ip6string.h"
 #include <stdint.h>
 #include <stddef.h>
 #include <string.h>
 #include <stdio.h>
 #include <stdlib.h>
 #endif

 #define TRACE_GROUP "DHP"

 #ifdef FSR
  #define VENDOR_ID_CLASS "fsr"
  #elif defined(LIGHT)
  #define VENDOR_ID_CLASS "light"
  #elif !defined(FSR) || !defined (LIGHT)
  #define VENDOR_ID_CLASS "br"
 #endif

 #define IEEE_MAC_ADDRESS_LOCATION    0x500012F0
 #define APIMAC_SADDR_EXT_LEN 8
 #define COAP_CONNECT_WEB_APP_URI "connect_web_app"
 #define COAP_PORT 5683
 extern int8_t service_id;
 
 typedef struct {
     dhcp_client_global_adress_cb *global_address_cb;
     dhcp_client_options_notify_cb *option_information_cb;
     uint16_t service_instance;
     uint16_t relay_instance;
     uint16_t sol_timeout;
     uint16_t sol_max_rt;
     uint8_t sol_max_rc;
     uint8_t libDhcp_instance;
     dhcp_duid_options_params_t duid;
     int8_t interface;
     bool renew_uses_solicit: 1;
     bool one_instance_interface: 1;
     bool no_address_hint: 1;
     ns_list_link_t      link;                   /*!< List link entry */
 } dhcp_client_class_t;
 
 static NS_LARGE NS_LIST_DEFINE(dhcp_client_list, dhcp_client_class_t, link);
 
 static bool dhcpv6_client_set_address(int8_t interface_id, dhcpv6_client_server_data_t *srv_data_ptr);
 void dhcpv6_renew(protocol_interface_info_entry_t *interface, if_address_entry_t *addr, if_address_callback_t reason);
 
 
 
 static dhcp_client_class_t *dhcpv6_client_entry_allocate(int8_t interface, uint8_t duid_length)
 {
     dhcp_client_class_t *entry = ns_dyn_mem_alloc(sizeof(dhcp_client_class_t));
     uint8_t *duid  = ns_dyn_mem_alloc(duid_length);
     if (!entry || !duid) {
         ns_dyn_mem_free(entry);
         ns_dyn_mem_free(duid);
         return NULL;
 
     }
     memset(entry, 0, sizeof(dhcp_client_class_t));
     entry->interface = interface;
     entry->service_instance = dhcp_service_init(interface, DHCP_INSTANCE_CLIENT, NULL);
     entry->libDhcp_instance = libdhcpv6_nonTemporal_entry_get_unique_instance_id();
     entry->duid.duid = duid;
     entry->duid.duid_length = duid_length;
     entry->duid.type = DHCPV6_DUID_LINK_LAYER_TYPE;
     ns_list_add_to_end(&dhcp_client_list, entry);
     return entry;
 }
 
 //Discover DHCPv6 client
 static dhcp_client_class_t *dhcpv6_client_entry_discover(int8_t interface)
 {
     ns_list_foreach(dhcp_client_class_t, cur, &dhcp_client_list) {
         //Check All allocated address in this module
         if (cur->interface == interface) {
             return cur;
         }
     }
 
     return NULL;
 }
 
 
 void dhcp_client_init(int8_t interface, uint16_t link_type)
 {
     protocol_interface_info_entry_t *interface_ptr = protocol_stack_interface_info_get_by_id(interface);
     if (!interface_ptr) {
         return;
     }
 
 
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
 
     if (dhcp_client) {
         dhcp_client->sol_timeout = 0;
         dhcp_client->sol_max_rt = 0;
         dhcp_client->sol_max_rc = 0;
         dhcp_client->renew_uses_solicit = false;
         dhcp_client->one_instance_interface = false;
         dhcp_client->no_address_hint = false;
         dhcp_client->service_instance = dhcp_service_init(interface, DHCP_INSTANCE_CLIENT, NULL);
         dhcp_client->libDhcp_instance = libdhcpv6_nonTemporal_entry_get_unique_instance_id();
         return;
     }
     //Allocate new
     //define DUID-LL length based on MAC64 or MAC48
 
     dhcp_client = dhcpv6_client_entry_allocate(interface, libdhcpv6_duid_linktype_size(link_type) + 2);
     if (!dhcp_client) {
         return;
     }
 
     uint8_t *ptr = dhcp_client->duid.duid;
     ptr = common_write_16_bit(link_type, ptr);
     memcpy(ptr, interface_ptr->mac, libdhcpv6_duid_linktype_size(link_type));
 
     //Define DUID
 
 
 }
 void dhcp_client_configure(int8_t interface, bool renew_uses_solicit, bool one_client_for_this_interface, bool no_address_hint)
 {
     // Set true if RENEW is not used and SOLICIT sent instead.
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return;
     }
     dhcp_client->renew_uses_solicit = renew_uses_solicit;
     dhcp_client->one_instance_interface = one_client_for_this_interface;
     dhcp_client->no_address_hint = no_address_hint;
 }
 
 void dhcp_client_solicit_timeout_set(int8_t interface, uint16_t timeout, uint16_t max_rt, uint8_t max_rc)
 {
     // Set the default retry values for SOLICIT and RENEW messages.
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return;
     }
     dhcp_client->sol_timeout = timeout;
     dhcp_client->sol_max_rt = max_rt;
     dhcp_client->sol_max_rc = max_rc;
 
     return;
 }
 
 int dhcp_client_option_notification_cb_set(int8_t interface, dhcp_client_options_notify_cb *notify_cb)
 {
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return -1;
     }
     dhcp_client->option_information_cb = notify_cb;
     return 0;
 
 }
 
 void dhcp_relay_agent_enable(int8_t interface, uint8_t border_router_address[static 16])
 {
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return;
     }
 
     dhcp_client->relay_instance = dhcp_service_init(interface, DHCP_INTANCE_RELAY_AGENT, NULL);
     dhcp_service_relay_instance_enable(dhcp_client->relay_instance, border_router_address);
 }
 
 void dhcp_relay_agent_interface_id_option_enable(int8_t interface, bool enable)
 {
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return;
     }
 
     dhcp_service_relay_interface_id_option_enable(dhcp_client->relay_instance, enable);
 }
 
 void dhcp_client_delete(int8_t interface)
 {
     protocol_interface_info_entry_t *cur = NULL;
     dhcpv6_client_server_data_t *srv_data_ptr;
     uint8_t temporary_address[16];
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         return;
     }
 
 
     dhcp_service_delete(dhcp_client->service_instance);
 
 
     cur = protocol_stack_interface_info_get_by_id(interface);
 
     if (!cur) {
         return;
     }
 
     do {
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_instance(dhcp_client->libDhcp_instance);
         if (srv_data_ptr != NULL) {
             tr_debug("Free DHCPv6 Client\n");
             memcpy(temporary_address, srv_data_ptr->iaNontemporalAddress.addressPrefix, 16);
             dhcp_service_req_remove_all(srv_data_ptr);// remove all pending retransmissions
             libdhcvp6_nontemporalAddress_server_data_free(srv_data_ptr);
             addr_delete(cur, temporary_address);
 
         }
     } while (srv_data_ptr != NULL);
     dhcp_client->service_instance = 0;
     return;
 }
 
 
 void dhcpv6_client_send_error_cb(dhcpv6_client_server_data_t *srv_data_ptr)
 {
     if (srv_data_ptr != NULL) {
         dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(srv_data_ptr->interfaceId);
         if (!dhcp_client) {
             return;
         }
 
         // error for Global address
         if (dhcp_client->global_address_cb != NULL) {
             dhcp_client->global_address_cb(dhcp_client->interface, srv_data_ptr->server_address, srv_data_ptr->iaNontemporalAddress.addressPrefix, false);
         }
     }
 }
 
 
 static void dhcp_vendor_information_notify(uint8_t *ptr, uint16_t data_len, dhcp_client_class_t *dhcp_client, dhcpv6_client_server_data_t *srv_data_ptr)
 {
     if (!dhcp_client->option_information_cb) {
         return;
     }
 
     if (!srv_data_ptr->iaNontemporalAddress.validLifetime) {
         return; //Valid Lifetime zero
     }
 
     dhcp_option_notify_t dhcp_option;
 
     uint16_t type, length;
     bool valid_optional_options;
 
     dhcp_server_notify_info_t server_info;
     server_info.life_time = srv_data_ptr->iaNontemporalAddress.validLifetime;
     server_info.duid = srv_data_ptr->serverDUID.duid + 2; // Skip the type
     server_info.duid_type = srv_data_ptr->serverDUID.type;
     server_info.duid_length = srv_data_ptr->serverDUID.duid_length - 2;// remove the type
 
     while (data_len >= 4) {
         type = common_read_16_bit(ptr);
         ptr += 2;
         length = common_read_16_bit(ptr);
         ptr += 2;
         data_len -= 4;
         if (data_len < length) {
             return;
         }
         valid_optional_options = false;
         //Accept only listed items below with validated lengths
         if ((type == DHCPV6_OPTION_VENDOR_SPECIFIC_INFO || type == DHCPV6_OPTION_VENDOR_CLASS) && data_len >= 4) {
             valid_optional_options = true;
             //Parse enterprise number
             dhcp_option.option.vendor_spesific.enterprise_number = common_read_32_bit(ptr);
             ptr += 4;
             data_len -= 4;
             length -= 4;
             dhcp_option.option.vendor_spesific.data = ptr;
             dhcp_option.option.vendor_spesific.data_length = length;
 
 
         } else if (type == DHCPV6_OPTION_DNS_SERVERS && (length >= 16 && ((length % 16) == 0))) {
             valid_optional_options = true;
             dhcp_option.option.generic.data = ptr;
             dhcp_option.option.generic.data_length = length;
         } else if (type == DHCPV6_OPTION_DOMAIN_LIST) {
             valid_optional_options = true;
             dhcp_option.option.generic.data = ptr;
             dhcp_option.option.generic.data_length = length;
         }
         if (valid_optional_options) {
             dhcp_option.option_type = type;
             dhcp_client->option_information_cb(dhcp_client->interface, &dhcp_option, &server_info);
         }
         data_len -= length;
         ptr += length;
     }
 }
 
 /* solication responce received for either global address or routter id assignment */
 int dhcp_solicit_resp_cb(uint16_t instance_id, void *ptr, uint8_t msg_name,  uint8_t *msg_ptr, uint16_t msg_len)
 {
     dhcp_ia_non_temporal_params_t dhcp_ia_non_temporal_params;
     dhcp_duid_options_params_t clientId;
     dhcp_duid_options_params_t serverId;
     dhcpv6_client_server_data_t *srv_data_ptr = NULL;
     (void)instance_id;
 
     //Validate that started TR ID class is still at list
     srv_data_ptr = libdhcpv6_nonTemporal_validate_class_pointer(ptr);
 
 
     if (srv_data_ptr == NULL) {
         tr_error("server data not found");
         goto error_exit;
     }
 
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(srv_data_ptr->interfaceId);
     if (!dhcp_client) {
         tr_error("No DHCPv6 client avilabale");
         goto error_exit;
     }
 
 
     //Clear Active Transaction state
     srv_data_ptr->transActionId = 0;
 
     // Validate message
     if (msg_name != DHCPV6_REPLY_TYPE) {
         tr_error("invalid response");
         goto error_exit;
     }
 
     if (libdhcpv6_reply_message_option_validate(&clientId, &serverId, &dhcp_ia_non_temporal_params, msg_ptr, msg_len) != 0) {
         tr_error("Reply Not include all Options");
         goto error_exit;
     }
 
     if (libdhcpv6_nonTemporal_entry_get_by_iaid(dhcp_ia_non_temporal_params.iaId) != srv_data_ptr) {
         /* Validate server data availability */
         tr_error("Valid instance not found");
         goto error_exit;
     }
 
     if (srv_data_ptr->IAID != dhcp_ia_non_temporal_params.iaId) {
         tr_error("Wrong IAID");
         goto error_exit;
     }
 
     if (libdhcpv6_compare_DUID(&srv_data_ptr->clientDUID, &clientId) != 0) {
         tr_error("Not Valid Client Id");
         goto error_exit;
     }
 
     //Allocate dynamically new Server DUID if needed
     if (!srv_data_ptr->serverDynamic_DUID || serverId.duid_length > srv_data_ptr->dyn_server_duid_length) {
         //Allocate dynamic new bigger
         srv_data_ptr->dyn_server_duid_length = 0;
         ns_dyn_mem_free(srv_data_ptr->serverDynamic_DUID);
         srv_data_ptr->serverDynamic_DUID = ns_dyn_mem_alloc(serverId.duid_length);
         if (!srv_data_ptr->serverDynamic_DUID) {
             tr_error("Dynamic DUID alloc fail");
             goto error_exit;
         }
         srv_data_ptr->dyn_server_duid_length = serverId.duid_length;
     }
 
     //Copy Server DUID
     srv_data_ptr->serverDUID.duid = srv_data_ptr->serverDynamic_DUID;
     srv_data_ptr->serverDUID.type = serverId.type;
     srv_data_ptr->serverDUID.duid_length = serverId.duid_length;
     memcpy(srv_data_ptr->serverDUID.duid, serverId.duid, serverId.duid_length);
 
     if (dhcp_client->one_instance_interface && memcmp(srv_data_ptr->iaNontemporalAddress.addressPrefix, dhcp_ia_non_temporal_params.nonTemporalAddress, 16)) {
 
         protocol_interface_info_entry_t *cur = protocol_stack_interface_info_get_by_id(dhcp_client->interface);
         if (cur) {
             addr_deprecate(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix);
         }
     }
 
     memcpy(srv_data_ptr->iaNontemporalAddress.addressPrefix, dhcp_ia_non_temporal_params.nonTemporalAddress, 16);
     srv_data_ptr->iaNontemporalAddress.preferredTime = dhcp_ia_non_temporal_params.preferredValidLifeTime;
     srv_data_ptr->iaNontemporalAddress.validLifetime = dhcp_ia_non_temporal_params.validLifeTime;
     srv_data_ptr->T0 = dhcp_ia_non_temporal_params.T0;
     srv_data_ptr->T1  = dhcp_ia_non_temporal_params.T1;
 
 
     bool status = dhcpv6_client_set_address(dhcp_client->interface, srv_data_ptr);
 
 
     if (dhcp_client->global_address_cb) {
         dhcp_client->global_address_cb(dhcp_client->interface, srv_data_ptr->server_address, srv_data_ptr->iaNontemporalAddress.addressPrefix, status);
     }
 
     //Optional Options notify from Reply
     dhcp_vendor_information_notify(msg_ptr, msg_len, dhcp_client, srv_data_ptr);
 
     return RET_MSG_ACCEPTED;
 error_exit:
     dhcpv6_client_send_error_cb(srv_data_ptr);
     return RET_MSG_ACCEPTED;
 }
 
 int dhcp_client_get_global_address(int8_t interface, uint8_t dhcp_addr[static 16], uint8_t prefix[static 16], dhcp_client_global_adress_cb *error_cb)
 {
     dhcpv6_solication_base_packet_s solPacket = {0};
 
     uint8_t *payload_ptr;
     uint32_t payload_len;
     dhcpv6_client_server_data_t *srv_data_ptr;
     bool add_prefix;
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
 
     if (dhcp_addr == NULL  || !dhcp_client) {
         tr_error("Invalid parameters");
         return -1;
     }
 
     if (!prefix || dhcp_client->one_instance_interface) {
         //NULL Definition will only check That Interface is not generated
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_instance(dhcp_client->libDhcp_instance);
         if (srv_data_ptr) {
             //Already Created to same interface
             if (dhcp_client->one_instance_interface && prefix) {
                 if (srv_data_ptr->iaNonTemporalStructValid) {
                     if (memcmp(srv_data_ptr->iaNontemporalAddress.addressPrefix, prefix, 8) == 0) {
                         return 0;
                     }
 
                     protocol_interface_info_entry_t *cur = protocol_stack_interface_info_get_by_id(interface);
                     if (!cur) {
                         return -1;
                     }
 
                     dhcp_service_req_remove_all(srv_data_ptr);// remove all pending retransmissions
                     addr_deprecate(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix);
                     srv_data_ptr->iaNonTemporalStructValid = false;
                     memcpy(srv_data_ptr->iaNontemporalAddress.addressPrefix, prefix, 8);
                     goto dhcp_address_get;
 
                 } else if (dhcp_client_server_address_update(interface, prefix, dhcp_addr) == 0) {
                     //DHCP server address OK
                     return 0;
                 }
             }
             return -1;
 
         }
     } else if (dhcp_client_server_address_update(interface, prefix, dhcp_addr) == 0) {
         //No need for allocate new
         return 0;
     }
 
     tr_debug("GEN new Dhcpv6 client %u", dhcp_client->libDhcp_instance);
     srv_data_ptr = libdhcvp6_nontemporalAddress_server_data_allocate(interface, dhcp_client->libDhcp_instance, prefix, dhcp_addr);
 
     if (!srv_data_ptr) {
         tr_error("OOM srv_data_ptr");
         return -1;
     }
     //SET DUID
     srv_data_ptr->clientDUID = dhcp_client->duid;
 
 dhcp_address_get:
 
     if (!prefix || dhcp_client->no_address_hint) {
         add_prefix = false;
     } else {
         add_prefix = prefix != NULL;
     }
 
     // Define vendor class data
     const char *vendor_class_str = VENDOR_ID_CLASS;
     uint16_t vendor_class_len = strlen(vendor_class_str);
     uint16_t option16_total_len = 4 + 2 + vendor_class_len; // enterprise number(4) + data length(2) + data
 
     // Calculate payload length with vendor class option
     payload_len = libdhcpv6_solication_message_length(srv_data_ptr->clientDUID.duid_length, add_prefix, 0) + option16_total_len;
 
     payload_ptr = ns_dyn_mem_temporary_alloc(payload_len);
     if (!payload_ptr) {
         libdhcvp6_nontemporalAddress_server_data_free(srv_data_ptr);
         tr_error("OOM payload_ptr");
         return -1;
     }
 
     dhcp_client->global_address_cb = error_cb;
     srv_data_ptr->GlobalAddress = true;
     // Build solicit
     solPacket.clientDUID = srv_data_ptr->clientDUID;
     solPacket.iaID = srv_data_ptr->IAID;
     solPacket.messageType = DHCPV6_SOLICATION_TYPE;
     solPacket.transActionId = libdhcpv6_txid_get();
     
     uint8_t *ptr;
     /*Non Temporal Address */
     if (prefix && !dhcp_client->no_address_hint) {
         dhcpv6_ia_non_temporal_address_s nonTemporalAddress = {0};
         nonTemporalAddress.requestedAddress = prefix;
         ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &solPacket, &nonTemporalAddress, NULL);
     } else {
         ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &solPacket, NULL, NULL);
     }
     
     // Add Vendor Class Option (16)
     ptr = common_write_16_bit(DHCPV6_OPTION_VENDOR_CLASS, ptr);
     ptr = common_write_16_bit(option16_total_len, ptr); // Option length
     ptr = common_write_32_bit(294, ptr); // Enterprise number
     ptr = common_write_16_bit(vendor_class_len, ptr); // Vendor class data length
     memcpy(ptr, vendor_class_str, vendor_class_len); // Vendor class data
     ptr += vendor_class_len;
     
     uint16_t actual_length = ptr - payload_ptr;
 
     // send solicit
     srv_data_ptr->transActionId = dhcp_service_send_req(dhcp_client->service_instance, 0, srv_data_ptr, dhcp_addr, payload_ptr, actual_length, dhcp_solicit_resp_cb);
     if (srv_data_ptr->transActionId == 0) {
         ns_dyn_mem_free(payload_ptr);
         libdhcvp6_nontemporalAddress_server_data_free(srv_data_ptr);
         return -1;
     }
     srv_data_ptr->iaNonTemporalStructValid = false;
     if (dhcp_client->sol_timeout != 0) {
         // Default retry values are modified from specification update to message
         dhcp_service_set_retry_timers(srv_data_ptr->transActionId, dhcp_client->sol_timeout, dhcp_client->sol_max_rt, dhcp_client->sol_max_rc);
     }
 
     return 0;
 }
 
 int dhcp_client_server_address_update(int8_t interface, uint8_t *prefix, uint8_t server_address[static 16])
 {
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface);
     if (!dhcp_client) {
         tr_debug("Interface not match");
         return -1;
     }
 
     dhcpv6_client_server_data_t *srv_data_ptr = NULL;
 
     if (prefix) {
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_prefix(interface, prefix);
     } else if (dhcp_client->one_instance_interface) {
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_instance(dhcp_client->libDhcp_instance);
     }
     if (!srv_data_ptr) {
         return -1;
     }
 
     if (memcmp(srv_data_ptr->server_address, server_address, 16) == 0) {
         return 0;
     }
 
     memcpy(srv_data_ptr->server_address, server_address, 16);
     if (srv_data_ptr->transActionId) {
         dhcp_service_update_server_address(srv_data_ptr->transActionId, server_address);
     }
     return 0;
 }
 
 
 
 void dhcp_client_global_address_renew(int8_t interface)
 {
     (void)interface;
     return;
 }
 
 void dhcp_client_global_address_delete(int8_t interface, uint8_t *dhcp_addr, uint8_t prefix[static 16])
 {
     protocol_interface_info_entry_t *cur;
     dhcpv6_client_server_data_t *srv_data_ptr;
     dhcp_client_class_t *dhcp_client;
     (void) dhcp_addr;
 
     srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_prefix(interface, prefix);
     cur = protocol_stack_interface_info_get_by_id(interface);
     dhcp_client = dhcpv6_client_entry_discover(interface);
 
     if (cur == NULL || srv_data_ptr == NULL || !dhcp_client) {
         return;
     }
 
     dhcp_service_req_remove_all(srv_data_ptr);// remove all pending retransmissions
     if (dhcp_client->one_instance_interface) {
         addr_deprecate(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix);
     } else {
         addr_delete(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix);
     }
 
     libdhcvp6_nontemporalAddress_server_data_free(srv_data_ptr);
 }
 
 void dhcpv6_renew(protocol_interface_info_entry_t *interface, if_address_entry_t *addr, if_address_callback_t reason)
 {
 
     uint8_t *payload_ptr;
     uint16_t payload_len;
     dhcp_client_class_t *dhcp_client = dhcpv6_client_entry_discover(interface->id);
     if (!dhcp_client) {
         return;
     }
 
     dhcpv6_client_server_data_t *srv_data_ptr;
     if (addr) {
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_prefix(interface->id, addr->address);
     } else {
         srv_data_ptr = libdhcpv6_nonTemporal_entry_get_by_instance(dhcp_client->libDhcp_instance);
     }
 
     if (srv_data_ptr == NULL) {
         return;
     }
     if (reason == ADDR_CALLBACK_INVALIDATED) {
         dhcp_service_req_remove_all(srv_data_ptr);// remove all pending retransmissions
         libdhcvp6_nontemporalAddress_server_data_free(srv_data_ptr);
         tr_warn("Dhcp address lost");
         return;
     }
 
     if (reason != ADDR_CALLBACK_TIMER) {
         return;
     }
 
     if (srv_data_ptr->transActionId) {
         //Do not trig new Renew process
         tr_warn("Do not trig new pending renew request");
         return;
     }
     bool skip_address_info = dhcp_client->no_address_hint;

     const char *vendor_class_str = VENDOR_ID_CLASS;
     uint16_t vendor_class_len = strlen(vendor_class_str);
     uint16_t option16_total_len = 4 + 2 + vendor_class_len; // enterprise number(4) + data length(2) + data
 
     // Allocate enough space for a Solicit message if enabled, otherwise allocate enough for a Renew message. It's okay to over-allocate if some options go unused.
     if (dhcp_client->renew_uses_solicit)
     {
         payload_len = libdhcpv6_solication_message_length(srv_data_ptr->clientDUID.duid_length, skip_address_info, 0) + option16_total_len;
     }
     else
     {
         payload_len = libdhcpv6_address_request_message_len(srv_data_ptr->clientDUID.duid_length, srv_data_ptr->serverDUID.duid_length, 0, !skip_address_info) + option16_total_len;
     }
 
     payload_ptr = ns_dyn_mem_temporary_alloc(payload_len);
     if (payload_ptr == NULL) {
         if (addr) {
             addr->state_timer = 200; //Retry after 20 seconds
         }
         tr_error("Out of memory");
         return ;
     }
     dhcpv6_solication_base_packet_s packetReq = {
         .messageType = DHCPV6_RENEW_TYPE,
         .clientDUID = srv_data_ptr->clientDUID,
         .requestedOptionCnt = 0,
         .iaID = srv_data_ptr->IAID,
         .timerT0 = srv_data_ptr->T0,
         .timerT1 = srv_data_ptr->T1,
         .requestedOptionList = NULL,
     };
 
     if (dhcp_client->renew_uses_solicit) {
         packetReq.messageType = DHCPV6_SOLICATION_TYPE;
     }
 
     uint8_t* returned_ptr;
 
     if (skip_address_info) {
         packetReq.timerT0 = 0;
         packetReq.timerT1 = 0;
 
         // RFC 8415 States that DHCP Solicit messages explicitly CANNOT include the Server Identifier, so don't use it when making a Solicit message
         if(dhcp_client->renew_uses_solicit)
         {
             returned_ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &packetReq, NULL, NULL);
         }
         else
         {
             returned_ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &packetReq, NULL, &srv_data_ptr->serverDUID);
         }
     } else {
         // Set Address information
         dhcpv6_ia_non_temporal_address_s nonTemporalAddress = {0};
         nonTemporalAddress.requestedAddress = srv_data_ptr->iaNontemporalAddress.addressPrefix;
         nonTemporalAddress.preferredLifeTime = srv_data_ptr->iaNontemporalAddress.preferredTime;
         nonTemporalAddress.validLifeTime = srv_data_ptr->iaNontemporalAddress.validLifetime;
 
         if(dhcp_client->renew_uses_solicit)
         {
             returned_ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &packetReq, &nonTemporalAddress, NULL);
         }
         else
         {
             returned_ptr = libdhcpv6_generic_nontemporal_address_message_write(payload_ptr, &packetReq, &nonTemporalAddress, &srv_data_ptr->serverDUID);
         }
     }
 
     uint16_t payload_bytes_written = ((uint32_t) returned_ptr) - ((uint32_t) payload_ptr);
 
     if(payload_bytes_written > payload_len)
     {
         tr_error("Wrote too many bytes to the heap when trying to renew our DHCP address!");
         return;
     }
 
     // Get address
     uint8_t *server_address = dhcp_service_relay_global_addres_get(dhcp_client->relay_instance);
     if (!server_address) {
         server_address = srv_data_ptr->server_address;
     }

     // Add Vendor Class Option (16)
     returned_ptr = common_write_16_bit(DHCPV6_OPTION_VENDOR_CLASS, returned_ptr);
     returned_ptr = common_write_16_bit(option16_total_len, returned_ptr); // Option length
     returned_ptr = common_write_32_bit(294, returned_ptr); // Enterprise number
     returned_ptr = common_write_16_bit(vendor_class_len, returned_ptr); // Vendor class data length
     memcpy(returned_ptr, vendor_class_str, vendor_class_len); // Vendor class data
     returned_ptr += vendor_class_len;
     
     uint16_t actual_length = returned_ptr - payload_ptr;
 
     // Send message
     srv_data_ptr->transActionId = dhcp_service_send_req(dhcp_client->service_instance, 0, srv_data_ptr, server_address, payload_ptr, actual_length, dhcp_solicit_resp_cb);
     if (srv_data_ptr->transActionId == 0) {
         ns_dyn_mem_free(payload_ptr);
         if (addr) {
             addr->state_timer = 200; //Retry after 20 seconds
         }
         tr_error("DHCP renew send failed");
     }
     if (packetReq.messageType == DHCPV6_SOLICATION_TYPE && dhcp_client->sol_timeout != 0) {
         // Default retry values are modified from specification update to message
         dhcp_service_set_retry_timers(srv_data_ptr->transActionId, dhcp_client->sol_timeout, dhcp_client->sol_max_rt, dhcp_client->sol_max_rc);
     }
     tr_info("DHCP renew send OK");
 }
 
 static bool dhcpv6_client_set_address(int8_t interface_id, dhcpv6_client_server_data_t *srv_data_ptr)
 {
     protocol_interface_info_entry_t *cur = NULL;
     if_address_entry_t *address_entry = NULL;
     uint32_t renewTimer;
     cur = protocol_stack_interface_info_get_by_id(interface_id);
     if (!cur) {
         return false;
     }
     renewTimer = libdhcpv6_renew_time_define(srv_data_ptr);
 
     srv_data_ptr->iaNonTemporalStructValid = true;
     address_entry = addr_get_entry(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix);
     if (address_entry == NULL) {
         // create new
         address_entry = addr_add(cur, srv_data_ptr->iaNontemporalAddress.addressPrefix, 64, ADDR_SOURCE_DHCP, srv_data_ptr->iaNontemporalAddress.validLifetime, srv_data_ptr->iaNontemporalAddress.preferredTime, false);
     } else {
         addr_set_valid_lifetime(cur, address_entry, srv_data_ptr->iaNontemporalAddress.validLifetime);
         addr_set_preferred_lifetime(cur, address_entry, srv_data_ptr->iaNontemporalAddress.preferredTime);
     }
 
     if (address_entry == NULL) {
         tr_error("Address add failed");
         srv_data_ptr->iaNonTemporalStructValid = false;
         return false;
     }
 
     if (renewTimer) {
         // translate seconds to 100ms ticks
         if (renewTimer  <  0xffffffff / 10) {
             renewTimer *= 10;
         } else {
             renewTimer = 0xfffffffe;
         }
     }
     address_entry->state_timer = renewTimer;
     address_entry->cb = dhcpv6_renew;

    #if defined (FSR) || defined (LIGHT)
    uint64_t macAddr;
    memcpy(&macAddr, (uint8_t *)(IEEE_MAC_ADDRESS_LOCATION),
           (APIMAC_SADDR_EXT_LEN));

     // Define the target multicast address string
    const char *multicast_target_addr_str = "2020:abcd::";
    const char *vendor_class = VENDOR_ID_CLASS;
    // Array to hold the binary address
    uint8_t multicast_target_addr[16];
    uint64_t mac_address_int = macAddr;
    char mac_address_str[17]; // 16 hex chars + null terminator
    char json_payload[100]; // Buffer for JSON payload, adjust size as needed

    // Convert the uint64_t MAC address to a hex string
    snprintf(mac_address_str, sizeof(mac_address_str), "%016llX", mac_address_int);

    // Construct the JSON payload
    snprintf(json_payload, sizeof(json_payload),
            "{\"vendor_class\":\"%s\",\"mac\":\"%s\"}",
            vendor_class, mac_address_str);

    // Convert the multicast string address to binary
    stoip6(multicast_target_addr_str, strlen(multicast_target_addr_str), multicast_target_addr);

    // Send the CoAP request as CONFIRMABLE to ensure acknowledgement and retransmission
    // The underlying coap_service library handles retransmissions for CONFIRMABLE messages.
    coap_service_request_send(service_id, 0,
                        multicast_target_addr, COAP_PORT,
                        COAP_MSG_TYPE_CONFIRMABLE, // Use CONFIRMABLE for acknowledgement
                        COAP_MSG_CODE_REQUEST_POST,
                        COAP_CONNECT_WEB_APP_URI,
                        COAP_CT_JSON, // Set content type to JSON
                        (uint8_t *) json_payload, strlen(json_payload), // Send JSON string
                        NULL); // No specific callback needed for ACK/RST handling by the library
    #endif
    
    
     return true;
 }
 
 #endif
 