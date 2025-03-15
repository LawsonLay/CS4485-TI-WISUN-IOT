SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
LNK = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
HEX = "$(TICLANG_ARMCOMPILER)/bin/tiarmobjcopy"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler ticlang --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler ticlang --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../../tirtos7/sensor.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = application_main.obj application_sensor_sensor.obj application_sensor_ssf.obj application_sensor_link_controller_jdllc.obj software_stack_ti15_4stack_mac_mac_settings_mac_user_config.obj application_cui_cui.obj software_stack_ti15_4stack_nv_crc.obj software_stack_ti15_4stack_nv_nvocmp.obj software_stack_ti15_4stack_mac_low_level_mac_activity.obj software_stack_ti15_4stack_mac_mac_settings_mac_cfg.obj software_stack_ti15_4stack_mac_mac_settings_mac_settings.obj software_stack_ti15_4stack_mac_macTask.obj software_stack_ti15_4stack_mac_api_mac.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = tfm_sensor

CFLAGS += -I../.. \
    -I. \
    $(addprefix @,$(SYSCFG_OPT_FILES)) \
    @../../application/defines/sensor.opt \
      \
    -I../../application/sensor \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/sensor" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cui" \
    -Oz \
    -std=gnu9x \
    -munaligned-access \
    -fshort-enums \
    -fcommon \
    -funsigned-char \
    -mlittle-endian \
    -fdiagnostics-show-option \
    -ffunction-sections \
    -fno-strict-aliasing \
    -g \
    -DxTIMAC_ROM_IMAGE_BUILD \
    -I../../application \
    -I../../software_stack/ti15_4stack/osal \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/boards" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/util" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/stack/src" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/stack/tirtos/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/heapmgr" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/services/saddr" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/services/sdata" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/hal/crypto" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/hal/platform" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/hal/rf" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/fh" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/high_level" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/rom" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/inc/cc13xx" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/tracer" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/tfm/interface/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/tfm/config" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/tfm/secure_fw/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tfm_s/build/cc26x4/production_full/Release/export/tfm/inc" \
    -DTFM_ENABLED=1 \
    -DS_NS_154_ENABLED \
    -DENABLE_SECURE_KEY_STORAGE=True \
    -DMBEDTLS_CONFIG_FILE="<configs/config-tidrivers.h>" \
    -DMBEDTLS_PSA_CRYPTO_CONFIG_FILE="<configs/config-psa-crypto-cc13x4.h>" \
    -DBoard_EXCLUDE_NVS_EXTERNAL_FLASH \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x4_cc26x4" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x4_cc26x4/driverlib" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x4_cc26x4/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbedtls/ti" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mbedtls/include" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/posix/ticlang" \
    -gdwarf-3 \
    -mcpu=cortex-m33 \
    -mfloat-abi=hard \
    -mfpu=fpv5-sp-d16

LFLAGS +=  \
    -Wl,--define=NVOCMP_NVPAGES=2 \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tfm_s" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    -Wl,--define=TIRTOS7 \
    -Wl,--unused_section_elimination=on \
    -Wl,--diag_wrap=off \
    "-Wl,--xml_link_info=$(NAME)_linkInfo.xml" \
    -Wl,-x \
    -Wl,--display_error_number \
    -Wl,--rom_model \
    -Wl,--warn_sections \
    ti_utils_build_linker.cmd.genlibs \
    ../../tirtos7/ticlang/cc13x4_cc26x4_ns.cmd \
    "-Wl,-m,$(NAME).map" \
    "-L$(TICLANG_ARMCOMPILER)/lib" \
    -llibc.a

all: $(NAME).hex

.INTERMEDIATE: syscfg
$(SYSCFG_FILES): syscfg
	@ echo generation complete

syscfg: ../../tirtos7/sensor.syscfg
	@ echo Generating configuration files...
	@ $(SYSCFG_CMD_STUB) --output $(@D) $<


# Helpful hint that the user needs to use a standalone SysConfig installation
$(SYSCONFIG_GUI_TOOL):
	$(error $(dir $(SYSCONFIG_TOOL)) does not contain the GUI framework \
        necessary to launch the SysConfig GUI.  Please set SYSCONFIG_TOOL \
        (in your SDK's imports.mak) to a standalone SysConfig installation \
        rather than one inside CCS)

syscfg-gui: ../../tirtos7/sensor.syscfg $(SYSCONFIG_GUI_TOOL)
	@ echo Opening SysConfig GUI
	@ $(SYSCFG_GUI_CMD_STUB) $<

define C_RULE
$(basename $(notdir $(1))).obj: $(1) $(SYSCFG_H_FILES)
	@ echo Building $$@
	@ $(CC) $(CFLAGS) -c $$< -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

application_main.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/sensor/main.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_sensor_sensor.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/sensor/sensor.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_sensor_ssf.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/sensor/ssf.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_sensor_link_controller_jdllc.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/jdllc/jdllc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_user_config.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/boards/mac_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

application_cui_cui.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cui/cui.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_nv_crc.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/crc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_nv_nvocmp.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/nvocmp.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_low_level_mac_activity.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_activity.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_cfg.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/high_level/mac_cfg.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_settings.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_settings.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_macTask.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/macTask.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

software_stack_ti15_4stack_mac_api_mac.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/api_mac.c $(SYSCFG_H_FILES)
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
