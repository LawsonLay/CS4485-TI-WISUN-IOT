COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../../..)

include $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
LNK = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler ticlang --product $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler ticlang --product $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../../tirtos7/dmm_154collector_remote_display_2_4g.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = application_main.obj software_stacks_ti15_4stack_radio_configuration_mac_user_config.obj application_collector_collector.obj application_collector_csf.obj application_collector_link_controller_cllc.obj application_cui_cui.obj application_collector_util_util_timer.obj application_collector_util_mac_util.obj software_stacks_ti15_4stack_stack_user_api_macTask.obj software_stacks_ti15_4stack_stack_user_api_api_mac.obj software_stacks_ti15_4stack_osal_port_osal_port.obj software_stacks_ti15_4stack_osal_port_osal_port_timers.obj application_ble_remote_display_remote_display.obj dmm_application_policy_dmm_priority_ble_154collector.obj software_stacks_ble_stack_icall_ble_rd_ble_user_config.obj software_stacks_ble_stack_profiles_remote_display_gatt_profile.obj software_stacks_ble_stack_profiles_provisioning_gatt_profile.obj software_stacks_ble_stack_profiles_network_device_gatt_profile.obj application_ble_remote_display_startup_osal_icall_ble.obj application_ble_remote_display_startup_rom_init.obj application_ble_remote_display_startup_ble_user_config_stack.obj software_stacks_ble_stack_rosc_rcosc_calibration.obj drivers_nv_nvocmp.obj drivers_nv_crc.obj software_stacks_ble_stack_icall_icall_cc2650.obj software_stacks_ble_stack_icall_icall_user_config.obj software_stacks_ble_stack_icall_ble_icall_api_lite.obj software_stacks_ble_stack_icall_ble_icall_hci_tl.obj software_stacks_ble_stack_profiles_devinfoservice.obj software_stacks_ble_stack_profiles_gattservapp_util.obj software_stacks_ble_stack_icall_icall.obj application_ble_remote_display_util_util.obj software_stacks_ti15_4stack_mac_high_level_mac_cfg.obj software_stacks_ti15_4stack_mac_low_level_mac_settings.obj software_stacks_ti15_4stack_mac_services_saddr.obj software_stacks_ti15_4stack_mac_hal_target_itm.obj software_stacks_ti15_4stack_mac_low_level_mac_activity.obj OAD_oad.obj OAD_oad_util.obj OAD_mark_switch_factory_img.obj OAD_oad_image_header_app.obj OAD_crc32.obj OAD_flash_interface_ext_rtos_NVS.obj OAD_bim_util.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = dmm_154collector_remote_display_oad_app_2_4g

CFLAGS += -I../.. \
    -I. \
    $(addprefix @,$(SYSCFG_OPT_FILES)) \
    -march=thumbv7em \
    -mcpu=cortex-m4 \
    -mthumb \
    -mfloat-abi=hard \
    -mfpu=fpv4-sp-d16 \
    -Oz \
    -mlittle-endian \
    -fshort-enums \
    -munaligned-access \
    -funsigned-char \
    -fcommon \
    -ffunction-sections \
    -fdata-sections \
    -std=gnu9x \
    "-I$(TICLANG_ARMCOMPILER)/include" \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/apps/ \
    @../../TOOLS/defines/dmm_154collector_remote_display_app_2_4g.opts \
    -I../../application/collector \
    -DxFEATURE_ENHANCED_ACK \
     \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/common/boards \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/remote_display_profile_154 \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/provisioning_profile \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/network_device_profile \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/apps/common/ti154stack/source/ble_remote_display/app/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/apps/common/ti154stack/source/ble_remote_display/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/dmm/apps/dmm_154collector_remote_display/source/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/apps/collector \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/common/cui \
    -DxUSE_ITM_DBG \
    -DTIMAC_ROM_IMAGE_BUILD \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/common \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/common/util \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/common/osal_port \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/common/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/fh \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/high_level \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/rom \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/inc/cc13xx \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/low_level/cc13xx \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/low_level/cc13xx/2_4g \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/tracer \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/hal/platform \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/hal/crypto \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/hal/rf \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/services/sdata \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/services/saddr \
    @../../TOOLS/build_components.opt \
    @../../TOOLS/factory_config.opt \
    -DFLASH_ROM_BUILD \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/common/cc26xx/npi/stack/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/common/cc26xx/rcosc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/controller/cc26xx/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/rom \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/common/cc26xx \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/icall/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/hal/src/common \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/hal/src/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/hal/src/target/_common \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/heapmgr \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/profiles/dev_info \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/profiles/simple_profile \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/icall/src/ \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/icall/src/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack/osal/src/inc \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/common/nv \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/common/cc26xx \
    -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ble5stack \
     -DCC26XX \
     -DCC26X2 \
     -DCC26X2R1_LAUNCHXL \
     -DSUPPORT_PHY_CUSTOM \
     -DNVOCMP_NVPAGES=2 \
    " -I$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
     -DSUPPORT_PHY_2_4_100KBPS2GFSK \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/devices/cc13x2_cc26x2 \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/devices/cc13x2_cc26x2/inc \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/devices/cc13x2_cc26x2/rf_patches \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/devices/cc13x2_cc26x2/driverlib \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/posix \
     -I${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/posix/ticlang \
     -DNVSSPI \
     -DDMM_OAD \
     -DSECURITY \
     -DTIRTOS7_SUPPORT \
     -DHEAPMGR_CONFIG=0x80 \
     -DHEAPMGR_SIZE=0x00 \
    " -I$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    " -I$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/posix/ticlang" \
    -gdwarf-3 \
    -march=armv7e-m

LFLAGS +=  -l${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/source/ti/ti154stack/rom/lib/ticlang/timac_rom_PG2_0_rom_api_linker.cmd \
    --define=FLASH_ROM_BUILD=2 \
    --define=OAD_IMG_E=1 \
    --define=SECURITY=1  \
     -l${PROJECT_BUILD_DIR}/syscfg/ti_utils_build_linker.cmd.genlibs \
    " -i$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    " -l$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/common/tirtos/ccs/cc26x2_app_oad_agama_tirtos7.cmd" \
    "-L$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    -Wl,--unused_section_elimination=on \
    -Wl,--diag_wrap=off \
    -Wl,--xml_link_info=${ProjName}_linkInfo.xml \
    -Wl,-x \
    -Wl,--display_error_number \
    ti_utils_build_linker.cmd.genlibs \
    " -l$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/driverlib/bin/ticlang/driverlib.lib" \
    "$(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/common/tirtos/ccs/cc26x2_app_oad_agama_tirtos7.cmd" \
    "-Wl,-m,$(NAME).map" \
    -Wl,--rom_model \
    -Wl,--warn_sections \
    "-L$(TICLANG_ARMCOMPILER)/lib" \
    -llibc.a

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).out
	${CG_TOOL_HEX} -order MS --memwidth=8 --romwidth=8 --intel -o ${ProjName}.hex ${ProjName}; ${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/tools/common/oad/oad_image_tool --verbose ccs ../.. 7 -hex1 ${ConfigName}/${ProjName}.hex -k ${COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR}/tools/common/oad/private.pem -o ${ConfigName}/${ProjName}

.INTERMEDIATE: syscfg
$(SYSCFG_FILES): syscfg
	@ echo generation complete

syscfg: ../../tirtos7/dmm_154collector_remote_display_2_4g.syscfg
	@ echo Generating configuration files...
	@ $(SYSCFG_CMD_STUB) --output $(@D) $<


# Helpful hint that the user needs to use a standalone SysConfig installation
$(SYSCONFIG_GUI_TOOL):
	$(error $(dir $(SYSCONFIG_TOOL)) does not contain the GUI framework \
        necessary to launch the SysConfig GUI.  Please set SYSCONFIG_TOOL \
        (in your SDK's imports.mak) to a standalone SysConfig installation \
        rather than one inside CCS)

syscfg-gui: ../../tirtos7/dmm_154collector_remote_display_2_4g.syscfg $(SYSCONFIG_GUI_TOOL)
	@ echo Opening SysConfig GUI
	@ $(SYSCFG_GUI_CMD_STUB) $<

define C_RULE
$(basename $(notdir $(1))).obj: $(1) $(SYSCFG_H_FILES)
	@ echo Building $$@
	@ $(CC) $(CFLAGS) -c $$< -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

application_main.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/dmm_154collector_remote_display/source/main.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_radio_configuration_mac_user_config.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/boards/mac_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_collector_collector.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/collector/collector.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_collector_csf.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/collector/csf.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_collector_link_controller_cllc.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/cllc/cllc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_cui_cui.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cui/cui.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_collector_util_util_timer.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/util/util_timer.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_collector_util_mac_util.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/util/mac_util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_stack_user_api_macTask.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/macTask.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_stack_user_api_api_mac.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/api_mac.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_osal_port_osal_port.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/osal_port.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_osal_port_osal_port_timers.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/osal_port_timers.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_ble_remote_display_remote_display.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/common/ti154stack/source/ble_remote_display/app/remote_display.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

dmm_application_policy_dmm_priority_ble_154collector.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/dmm_priority_ble_154collector.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_ble_rd_ble_user_config.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/common/ti154stack/source/ble_remote_display/rd_ble_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_profiles_remote_display_gatt_profile.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/remote_display_profile_154/cc26xx/remote_display_gatt_profile.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_profiles_provisioning_gatt_profile.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/provisioning_profile/cc26xx/provisioning_gatt_profile.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_profiles_network_device_gatt_profile.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/network_device_profile/cc26xx/network_device_gatt_profile.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_ble_remote_display_startup_osal_icall_ble.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/dmm/apps/common/ble_remote_display/stack/osal_icall_ble.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_ble_remote_display_startup_rom_init.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/rom/agama_r1/rom_init.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_ble_remote_display_startup_ble_user_config_stack.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/stack/ble_user_config_stack.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_rosc_rcosc_calibration.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/common/cc26xx/rcosc/rcosc_calibration.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

drivers_nv_nvocmp.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/nvocmp.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

drivers_nv_crc.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/crc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_icall_cc2650.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/src/icall_cc2650.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_icall_user_config.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/src/icall_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_ble_icall_api_lite.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/app/icall_api_lite.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_ble_icall_hci_tl.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/app/icall_hci_tl.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_profiles_devinfoservice.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/profiles/dev_info/cc26xx/devinfoservice.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_profiles_gattservapp_util.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/host/gattservapp_util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ble_stack_icall_icall.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/icall/src/icall.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_ble_remote_display_util_util.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/common/cc26xx/util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_mac_high_level_mac_cfg.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/high_level/mac_cfg.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_mac_low_level_mac_settings.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_settings.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_mac_services_saddr.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/services/saddr/saddr.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_mac_hal_target_itm.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/tracer/itm.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stacks_ti15_4stack_mac_low_level_mac_activity.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_activity.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_oad.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/profiles/oad/cc26xx/oad.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_oad_util.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/profiles/oad/cc26xx/oad_util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_mark_switch_factory_img.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/profiles/oad/cc26xx/mark_switch_factory_img.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_oad_image_header_app.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/profiles/oad/cc26xx/oad_image_header_app.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_crc32.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/crc/crc32.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_flash_interface_ext_rtos_NVS.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/flash_interface/external/flash_interface_ext_rtos_NVS.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

OAD_bim_util.obj: $(COM_TI_SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/bim/bim_util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

$(NAME).out: $(OBJECTS)
	@ echo linking $@
	@ $(LNK) -Wl,-u,_c_int00 $(OBJECTS)  $(LFLAGS) -o $(NAME).out

clean:
	@ echo Cleaning...
	@ $(RM) $(OBJECTS) > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).out > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).map > $(DEVNULL) 2>&1
	@ $(RM) $(SYSCFG_FILES)> $(DEVNULL) 2>&1
