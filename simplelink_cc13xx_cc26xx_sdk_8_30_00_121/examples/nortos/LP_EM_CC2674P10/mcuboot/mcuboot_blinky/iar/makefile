SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(IAR_ARMCOMPILER)/bin/iccarm"
LNK = "$(IAR_ARMCOMPILER)/bin/ilinkarm"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler iar --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler iar --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../mcuboot_blinky.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = blinky.obj main_nortos.obj mcuboot_config_trace.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = mcuboot_blinky

# Each config-specific .mak file will initialize appropriate options (AFLAGS, CFLAGS, LFLAGS),
# which will then be appended to below.
CONFIG := TZ_DISABLED
ifeq ($(CONFIG), TZ_DISABLED)
	include TZ_Disabled.mak
else ifeq ($(CONFIG), TZ_ENABLED)
	include TZ_Enabled.mak
endif

CFLAGS += -I.. \
    -I. \
    $(addprefix -f,$(SYSCFG_OPT_FILES)) \
    -Ohz \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos/posix" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app/mcuboot_config" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/bootutil/include" \
    --debug \
    --silent \
    -e \
    --aeabi \
    --thumb \
    --diag_suppress=Pa050 \
    --cpu Cortex-M33 \
    --fpu VFPv5_sp \
    --vla

LFLAGS += --silent \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos" \
    -fti_utils_build_linker.cmd.genlibs \
    --config ../mcuboot_blinky_cc13x4_cc26x4.icf \
    --map "$(NAME).map" \
    --semihosting=iar_breakpoint \
    --cpu=Cortex-M33 \
    --fpu VFPv5_sp

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).out
	"$(IAR_ARMCOMPILER)/bin/ielftool" --bin ./$(NAME).out ./$(NAME)-noheader.bin
	$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tools/common/mcuboot/imgtool sign --header-size 0x80 --align 4 --slot-size 0x2b000 --version 1.0.0 --pad-header --pad --key $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/root-ec-p256.pem ./$(NAME)-noheader.bin ./$(NAME).bin
	$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tools/common/mcuboot/imgtool sign --header-size 0x80 --align 4 --slot-size 0x4e800 --version 1.0.0 --pad-header --pad --key $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/root-ec-p256.pem ./$(NAME)-noheader.bin ./$(NAME).p2.bin

.INTERMEDIATE: syscfg
$(SYSCFG_FILES): syscfg
	@ echo generation complete

syscfg: ../mcuboot_blinky.syscfg
	@ echo Generating configuration files...
	@ $(SYSCFG_CMD_STUB) --output $(@D) $<


# Helpful hint that the user needs to use a standalone SysConfig installation
$(SYSCONFIG_GUI_TOOL):
	$(error $(dir $(SYSCONFIG_TOOL)) does not contain the GUI framework \
        necessary to launch the SysConfig GUI.  Please set SYSCONFIG_TOOL \
        (in your SDK's imports.mak) to a standalone SysConfig installation \
        rather than one inside CCS)

syscfg-gui: ../mcuboot_blinky.syscfg $(SYSCONFIG_GUI_TOOL)
	@ echo Opening SysConfig GUI
	@ $(SYSCFG_GUI_CMD_STUB) $<

define C_RULE
$(basename $(notdir $(1))).obj: $(1) $(SYSCFG_H_FILES)
	@ echo Building $$@
	@ $(CC) $(CFLAGS) $$< -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

blinky.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/blinky_app/blinky.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

main_nortos.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/blinky_app/main_nortos.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

mcuboot_config_trace.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app/mcuboot_config/trace.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

$(NAME).out: $(OBJECTS)
	@ echo linking $@
	@ $(LNK)  $(OBJECTS)  $(LFLAGS) -o $(NAME).out

clean:
	@ echo Cleaning...
	@ $(RM) $(OBJECTS) > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).out > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).map > $(DEVNULL) 2>&1
	@ $(RM) $(SYSCFG_FILES)> $(DEVNULL) 2>&1
