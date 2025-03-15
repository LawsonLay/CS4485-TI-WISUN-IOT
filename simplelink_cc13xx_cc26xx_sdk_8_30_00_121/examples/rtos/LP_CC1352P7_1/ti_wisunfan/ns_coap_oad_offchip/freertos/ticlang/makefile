SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
LNK = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
HEX = "$(TICLANG_ARMCOMPILER)/bin/tiarmobjcopy"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler ticlang --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler ticlang --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../../freertos/ti_wisunfan_coap_oad_offchip.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = application_main.obj application_application.obj mbed_ti-rf-driver_source_RFQueue.obj mbed_ti-nv-driver_crc.obj mbed_ti-nv-driver_nvocmp.obj mbed_frameworks_mbed-coap_source_sn_coap_builder.obj mbed_frameworks_mbed-coap_source_sn_coap_header_check.obj mbed_frameworks_mbed-coap_source_sn_coap_parser.obj mbed_frameworks_mbed-coap_source_sn_coap_protocol.obj mbed_nanostack_coap-service_source_coap_connection_handler.obj mbed_nanostack_coap-service_source_coap_message_handler.obj mbed_nanostack_coap-service_source_coap_security_handler.obj mbed_nanostack_coap-service_source_coap_service_api.obj application_oad_oad.obj application_oad_oad_storage.obj application_oad_flash_interface_ext_rtos_NVS.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_interrupt.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_random.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_timer.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_event_loop.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_event_loop_mutex.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_hal_init.obj mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_fhss_timer.obj mbed_mbednanostack2tirtos_platform_ns_trace.obj software_stack_ti15_4mac_mac_settings_mac_cfg.obj software_stack_ti15_4mac_mac_settings_mac_settings.obj software_stack_ti15_4mac_radio_configuration_mac_user_config.obj software_stack_ti15_4mac_macTask.obj software_stack_ti15_4mac_stack_user_api_api_mac_api_mac.obj software_stack_ti15_4mac_stack_user_api_api_mac_timac_fhss_config.obj software_stack_ti15_4mac_osal_port_osal_port.obj software_stack_ti15_4mac_osal_port_osal_port_timers.obj mbed_nanostack_mbed-mesh-api_source_wisun_tasklet.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = ns_coap_oad_offchip

# Each config-specific .mak file will initialize appropriate options (AFLAGS, CFLAGS, LFLAGS),
# which will then be appended to below.
CONFIG := RELEASE
ifeq ($(CONFIG), RELEASE)
	include Release.mak
endif

CFLAGS += -I../.. \
    -I. \
    $(addprefix @,$(SYSCFG_OPT_FILES)) \
    -Oz \
    -munaligned-access \
    -fshort-enums \
    -fcommon \
    -funsigned-char \
    -mlittle-endian \
    -fdiagnostics-show-option \
    -ffunction-sections \
    -g \
    -fno-strict-aliasing \
    -flto \
    -DCOAP_SERVICE_ENABLE \
    -DxCOAP_PANID_LIST \
    -DCOAP_OAD_ENABLE \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/flash_interface" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/low_level/cc13xx/combo" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/ti-rf-driver/ti-rf-driver" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/udp_nanostack_mesh_tirf" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/coap_oad_nanostack_tirf" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/common/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_config/ws_router" \
    -include mbed_config.h \
    @../../application/defines/router.opts \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/ti-rf-driver/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbedtls2tirtos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbedtls2tirtos/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbedtls2tirtos/mbedtls/mbed-crypto" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/nanostack-libservice/mbed-client-libservice" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/nanostack-libservice" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/nanostack-libservice/mbed-client-libservice/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-client-randlib/mbed-client-randlib/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-client-randlib/mbed-client-randlib" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-client-randlib" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-trace" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap/source/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/nanostack" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns/fnet" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns/fnet/fnet_stack" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns/fnet/fnet_stack/stack" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns/fnet/fnet_stack/services/serial" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Core/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/6LoWPAN" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack-eventloop" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack-eventloop/nanostack-event-loop" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack-eventloop/nanostack-event-loop/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/nanostack-hal-mbed-cmsis-rtos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/mbed-mesh-api/source/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/mbed-mesh-api/mbed-mesh-api" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/mbed-mesh-api" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/coap-service" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/source/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/ti_wisunfan/mbedtls" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/ti_wisunfan/mbedtls/platform/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/ti_wisunfan/mbedtls/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/ti_wisunfan/mbedtls/platform/COMPONENT_PSA_SRV_IMPL/COMPONENT_NSPE" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/shell" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/config" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/uip" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/uip/conf" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/uip/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/uip/pltfrm/sysbios" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/uip/net" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/services" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/hal/assert" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/hal/appasrt" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/hal/crypto" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/hal/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/hal/rf" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/high_level" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/low_level" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/boards" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/util" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/stack/src" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/stack/tirtos/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/heapmgr" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/services/saddr" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/services/sdata" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/fh" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/rom" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/inc/cc13xx" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/low_level/cc13xx" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/tracer" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/mbed-mesh-api/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/6LoWPAN/MAC" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/6LoWPAN/Thread" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Security/PANA" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/mdns/fnet/fnet_stack/services/mdns" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/fnv_hash" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/hmac" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/load_balance" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/libNET/src" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack-eventloop/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/ti_wisunfan/mbedtls/platform/COMPONENT_PSA_SRV_IMPL" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/whiteboard" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/6LoWPAN/ws" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/DHCPv6_client" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/libDHCPv6" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/utils" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Service_Libs/pan_blacklist" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/sal-stack-nanostack/source/Common_Protocols" \
    -DEXCLUDE_TRACE \
    -DxSWITCH_NCP_TO_TRACE \
    -DTLS_SEC_PROT_LIB_USE_MBEDTLS_PLATFORM_MEMORY \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/posix/ticlang" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/config" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/src" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/src/core" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/src/core/utils" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/examples/platforms" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/examples/ncp_ftd" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/examples/ncp_ftd/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/src/core/thread" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/src/ncp" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/ncp_interface/examples/ncp_ftd/platform/nv" \
    -DxWISUN_AUTO_START \
    -DTI_WISUN_FAN_DEBUG \
    -DDeviceFamily_CC13X2X7 \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2x7_cc26x2x7" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2x7_cc26x2x7/driverlib" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2x7_cc26x2x7/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/freertos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/freertos/builds/cc13x2_cc26x2/release/pregenerated_configuration" \
    -DFREERTOS_SUPPORT \
    -DFREERTOS \
    -DNVOCMP_POSIX_MUTEX \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/freertos/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/freertos/portable/GCC/ARM_CM4F" \
    -gdwarf-3 \
    -mcpu=cortex-m4 \
    -march=armv7e-m \
    -mthumb \
    -mfloat-abi=hard \
    -mfpu=fpv4-sp-d16

LFLAGS += "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel" \
     -Wl,--diag_suppress=10063 \
    -Wl,--define=FREERTOS \
    ti_utils_build_linker.cmd.genlibs \
    ../../freertos/ticlang/cc13x2x7_cc26x2x7_oad_offchip.cmd \
    "-Wl,-m,$(NAME).map" \
    -Wl,--rom_model \
    -Wl,--warn_sections \
    "-L$(TICLANG_ARMCOMPILER)/lib" \
    -llibc.a

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).hex
	$(TICLANG_ARMCOMPILER)/bin/tiarmobjcopy $(NAME).out --output-target binary $(NAME)-noheader.bin
	$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tools/common/mcuboot/imgtool sign --header-size 0x80 --align 4 --slot-size 0x56000 --pad --version 1.0.0 --pad-header --key $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/root-ec-p256.pem $(NAME)-noheader.bin $(NAME).bin;

.INTERMEDIATE: syscfg
$(SYSCFG_FILES): syscfg
	@ echo generation complete

syscfg: ../../freertos/ti_wisunfan_coap_oad_offchip.syscfg
	@ echo Generating configuration files...
	@ $(SYSCFG_CMD_STUB) --output $(@D) $<


# Helpful hint that the user needs to use a standalone SysConfig installation
$(SYSCONFIG_GUI_TOOL):
	$(error $(dir $(SYSCONFIG_TOOL)) does not contain the GUI framework \
        necessary to launch the SysConfig GUI.  Please set SYSCONFIG_TOOL \
        (in your SDK's imports.mak) to a standalone SysConfig installation \
        rather than one inside CCS)

syscfg-gui: ../../freertos/ti_wisunfan_coap_oad_offchip.syscfg $(SYSCONFIG_GUI_TOOL)
	@ echo Opening SysConfig GUI
	@ $(SYSCFG_GUI_CMD_STUB) $<

define C_RULE
$(basename $(notdir $(1))).obj: $(1) $(SYSCFG_H_FILES)
	@ echo Building $$@
	@ $(CC) $(CFLAGS) -c $$< -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

application_main.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/udp_nanostack_mesh_tirf/main.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_application.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/udp_nanostack_mesh_tirf/application.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_ti-rf-driver_source_RFQueue.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/ti-rf-driver/source/RFQueue.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_ti-nv-driver_crc.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/crc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_ti-nv-driver_nvocmp.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/nvocmp.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_frameworks_mbed-coap_source_sn_coap_builder.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap/source/sn_coap_builder.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_frameworks_mbed-coap_source_sn_coap_header_check.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap/source/sn_coap_header_check.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_frameworks_mbed-coap_source_sn_coap_parser.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap/source/sn_coap_parser.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_frameworks_mbed-coap_source_sn_coap_protocol.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/frameworks/mbed-coap/source/sn_coap_protocol.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_nanostack_coap-service_source_coap_connection_handler.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/source/coap_connection_handler.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_nanostack_coap-service_source_coap_message_handler.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/source/coap_message_handler.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_nanostack_coap-service_source_coap_security_handler.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/source/coap_security_handler.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_nanostack_coap-service_source_coap_service_api.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/coap-service/source/coap_service_api.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_oad_oad.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/coap_oad_nanostack_tirf/oad.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_oad_oad_storage.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/apps/coap_oad_nanostack_tirf/oad_storage.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_oad_flash_interface_ext_rtos_NVS.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/flash_interface/external/flash_interface_ext_rtos_NVS.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_interrupt.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/arm_hal_interrupt.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_random.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/arm_hal_random.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_timer.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/arm_hal_timer.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_event_loop.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/ns_event_loop.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_event_loop_mutex.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/ns_event_loop_mutex.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_ns_hal_init.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/ns_hal_init.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_nanostack_nanostack-hal-mbed-cmsis-rtos_arm_hal_fhss_timer.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/nanostack/nanostack-hal-mbed-cmsis-rtos/arm_hal_fhss_timer.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_mbednanostack2tirtos_platform_ns_trace.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/mbed_port/mbednanostack2tirtos/platform/ns_trace.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_mac_settings_mac_cfg.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/high_level/mac_cfg.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_mac_settings_mac_settings.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/low_level/cc13xx/mac_settings.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_radio_configuration_mac_user_config.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/boards/mac_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_macTask.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port/macTask.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_stack_user_api_api_mac_api_mac.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port/api_mac.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_stack_user_api_api_mac_timac_fhss_config.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port/timac_fhss_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_osal_port_osal_port.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port/osal_port_tirtos/osal_port.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4mac_osal_port_osal_port_timers.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti_wisunfan/wisunfan_mac/common/osal_port/osal_port_tirtos/osal_port_timers.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

mbed_nanostack_mbed-mesh-api_source_wisun_tasklet.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbed/nanostack/mbed-mesh-api/source/wisun_tasklet.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

$(NAME).out: $(OBJECTS)
	@ echo linking $@
	@ $(LNK) -Wl,-u,_c_int00 $(OBJECTS)  $(LFLAGS) -o $(NAME).out

$(NAME).hex: $(NAME).out
	@ echo building $@
	@ $(HEX) -O ihex $? $@

clean:
	@ echo Cleaning...
	@ $(RM) $(OBJECTS) > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).out > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).map > $(DEVNULL) 2>&1
# Possible intermediate files for hex generation
	@ $(RM) $(NAME).a* > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).i* > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).m* > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).t* > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).x* > $(DEVNULL) 2>&1
# End of intermediate files
	@ $(RM) $(NAME).hex > $(DEVNULL) 2>&1
	@ $(RM) $(SYSCFG_FILES)> $(DEVNULL) 2>&1
