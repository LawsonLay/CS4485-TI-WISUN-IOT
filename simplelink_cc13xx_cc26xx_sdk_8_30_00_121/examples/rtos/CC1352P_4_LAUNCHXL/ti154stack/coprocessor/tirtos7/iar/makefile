SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(IAR_ARMCOMPILER)/bin/iccarm"
LNK = "$(IAR_ARMCOMPILER)/bin/ilinkarm"
HEX = "$(IAR_ARMCOMPILER)/bin/ielftool"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler iar --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler iar --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../../tirtos7/coprocessor.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = application_coprocessor_main.obj application_coprocessor_mcp.obj software_stack_ti15_4stack_mac_mac_settings_mac_user_config.obj application_coprocessor_mt_mt.obj application_coprocessor_mt_mt_ext.obj application_coprocessor_mt_mt_mac.obj application_coprocessor_mt_mt_sys.obj application_coprocessor_mt_mt_util.obj application_launch_pad_board_led.obj software_stack_ti15_4stack_nv_crc.obj software_stack_ti15_4stack_nv_nvocmp.obj software_stack_ti15_4stack_mac_low_level_mac_activity.obj software_stack_ti15_4stack_mac_mac_settings_mac_cfg.obj software_stack_ti15_4stack_mac_mac_settings_mac_settings.obj software_stack_ti15_4stack_mac_macTask.obj software_stack_ti15_4stack_mac_api_mac.obj application_npi_npi_frame_mt.obj application_npi_npi_rxbuf.obj application_npi_npi_task.obj application_npi_npi_tl.obj application_npi_npi_tl_uart.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = coprocessor

CFLAGS += -I../.. \
    -I. \
    $(addprefix -f,$(SYSCFG_OPT_FILES)) \
    -f../../application/defines/coprocessor.opt \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv" \
    -Ohz \
    -DTIMAC_ROM_IMAGE_BUILD \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/boards" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/util" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/inc" \
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
    -DBoard_EXCLUDE_NVS_EXTERNAL_FLASH \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/driverlib" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/inc" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/posix/iar" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    --debug \
    --silent \
    -e \
    --aeabi \
    --thumb \
    --diag_suppress=Pa050 \
    --cpu Cortex-M4 \
    --fpu=VFPv4_sp \
    --vla

LFLAGS += "-f$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/rom/lib/iar/timac_rom_PG2_0_rom_api_linker.icf" \
    --config_def=NVOCMP_NVPAGES=4 \
    --redirect __aeabi_memcpy4=__aeabi_memcpy \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/tirtos7/packages" \
    -fti_utils_build_linker.cmd.genlibs \
    --config ../../tirtos7/iar/cc13x2_cc26x2.icf \
    --map "$(NAME).map" \
    --silent \
    --semihosting=iar_breakpoint \
    --cpu=Cortex-M4 \
    --fpu=VFPv4_sp

all: $(NAME).hex

.INTERMEDIATE: syscfg
$(SYSCFG_FILES): syscfg
	@ echo generation complete

syscfg: ../../tirtos7/coprocessor.syscfg
	@ echo Generating configuration files...
	@ $(SYSCFG_CMD_STUB) --output $(@D) $<


# Helpful hint that the user needs to use a standalone SysConfig installation
$(SYSCONFIG_GUI_TOOL):
	$(error $(dir $(SYSCONFIG_TOOL)) does not contain the GUI framework \
        necessary to launch the SysConfig GUI.  Please set SYSCONFIG_TOOL \
        (in your SDK's imports.mak) to a standalone SysConfig installation \
        rather than one inside CCS)

syscfg-gui: ../../tirtos7/coprocessor.syscfg $(SYSCONFIG_GUI_TOOL)
	@ echo Opening SysConfig GUI
	@ $(SYSCFG_GUI_CMD_STUB) $<

define C_RULE
$(basename $(notdir $(1))).obj: $(1) $(SYSCFG_H_FILES)
	@ echo Building $$@
	@ $(CC) $(CFLAGS) $$< -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

application_coprocessor_main.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/main.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mcp.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mcp.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_user_config.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/boards/mac_user_config.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mt_mt.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt/mt.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mt_mt_ext.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt/mt_ext.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mt_mt_mac.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt/mt_mac.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mt_mt_sys.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt/mt_sys.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_coprocessor_mt_mt_util.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/apps/coprocessor/mt/mt_util.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_launch_pad_board_led.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/util/launchpad/board_led.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_nv_crc.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/crc.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_nv_nvocmp.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/nv/nvocmp.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_low_level_mac_activity.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_activity.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_cfg.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/high_level/mac_cfg.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_mac_settings_mac_settings.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/low_level/cc13xx/mac_settings.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_macTask.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/macTask.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

software_stack_ti15_4stack_mac_api_mac.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/common/osal_port/osal_port_posix/api_mac.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_npi_npi_frame_mt.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/npi_frame_mt.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_npi_npi_rxbuf.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/npi_rxbuf.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_npi_npi_task.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/npi_task.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_npi_npi_tl.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/npi_tl.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

application_npi_npi_tl_uart.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ti154stack/npi/src/npi_tl_uart.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

$(NAME).out: $(OBJECTS)
	@ echo linking $@
	@ $(LNK)  $(OBJECTS)  $(LFLAGS) -o $(NAME).out

$(NAME).hex: $(NAME).out
	@ echo building $@
	@ $(HEX) --ihex --verbose $? $@

clean:
	@ echo Cleaning...
	@ $(RM) $(OBJECTS) > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).out > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).map > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).hex > $(DEVNULL) 2>&1
	@ $(RM) $(SYSCFG_FILES)> $(DEVNULL) 2>&1
