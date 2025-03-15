/*
 *  ======== ti_radio_config.h ========
 *  Configured RadioConfig module definitions
 *
 *  DO NOT EDIT - This file is generated for the CC1352P7RGZ
 *  by the SysConfig tool.
 *
 *  Radio Config module version : 1.20.0
 *  SmartRF Studio data version : 2.32.0
 */
#ifndef _TI_RADIO_CONFIG_H_
#define _TI_RADIO_CONFIG_H_

#include <ti/devices/DeviceFamily.h>
#include DeviceFamily_constructPath(driverlib/rf_mailbox.h)
#include DeviceFamily_constructPath(driverlib/rf_common_cmd.h)
#include DeviceFamily_constructPath(driverlib/rf_prop_cmd.h)
#include <ti/drivers/rf/RF.h>

/* SmartRF Studio version that the RF data is fetched from */
#define SMARTRF_STUDIO_VERSION "2.32.0"

// *********************************************************************************
//   RF Frontend configuration
// *********************************************************************************
// RF design based on: LP_CC1352P7-1
#define LP_CC1352P7_1

// High-Power Amplifier supported
#define SUPPORT_HIGH_PA

// RF frontend configuration
#define FRONTEND_SUB1G_DIFF_RF
#define FRONTEND_SUB1G_EXT_BIAS
#define FRONTEND_24G_DIFF_RF
#define FRONTEND_24G_EXT_BIAS

// Supported frequency bands
#define SUPPORT_FREQBAND_868
#define SUPPORT_FREQBAND_2400

// TX power table size definitions
#define TXPOWERTABLE_868_PA13_SIZE 20 // 868 MHz, 13 dBm
#define TXPOWERTABLE_868_PA20_SIZE 8 // 868 MHz, 20 dBm
#define TXPOWERTABLE_2400_PA5_SIZE 16 // 2400 MHz, 5 dBm

// TX power tables
extern RF_TxPowerTable_Entry txPowerTable_868_pa13[]; // 868 MHz, 13 dBm
extern RF_TxPowerTable_Entry txPowerTable_868_pa20[]; // 868 MHz, 20 dBm
extern RF_TxPowerTable_Entry txPowerTable_2400_pa5[]; // 2400 MHz, 5 dBm



//*********************************************************************************
//  RF Setting:   Wi-SUN mode #1b, 50 kbps, 25 kHz Deviation, 2-GFSK, 98 kHz RX Bandwidth
//
//  PHY:          2gfsk50kbps25dev915wsun1b
//  Setting file: setting_tc721.json
//*********************************************************************************

// Custom override offsets
#define TI_154_STACK_OVERRIDES_OFFSET 20

// PA table usage
#define TX_POWER_TABLE_SIZE_2gfsk50kbps154g TXPOWERTABLE_868_PA13_SIZE

#define txPowerTable_2gfsk50kbps154g txPowerTable_868_pa13

// TI-RTOS RF Mode object
extern RF_Mode RF_prop_2gfsk50kbps154g;

// RF Core API commands
extern const rfc_CMD_PROP_RADIO_DIV_SETUP_PA_t RF_cmdPropRadioDivSetup_2gfsk50kbps25dev915wsun1b;
extern const rfc_CMD_FS_t RF_cmdFs_2gfsk50kbps154g;
extern const rfc_CMD_PROP_TX_ADV_t RF_cmdPropTxAdv_2gfsk50kbps154g;
extern const rfc_CMD_PROP_RX_ADV_t RF_cmdPropRxAdv_2gfsk50kbps154g;
extern const rfc_CMD_PROP_CS_t RF_cmdPropCs_2gfsk50kbps154g;

// RF Core API overrides
extern uint32_t pOverrides_2gfsk50kbps154g[];

#endif // _TI_RADIO_CONFIG_H_
