SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(GCC_ARMCOMPILER)/bin/arm-none-eabi-gcc"
LNK = "$(GCC_ARMCOMPILER)/bin/arm-none-eabi-gcc"

SYSCONFIG_GUI_TOOL = $(dir $(SYSCONFIG_TOOL))sysconfig_gui$(suffix $(SYSCONFIG_TOOL))
SYSCFG_CMD_STUB = $(SYSCONFIG_TOOL) --compiler gcc --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_GUI_CMD_STUB = $(SYSCONFIG_GUI_TOOL) --compiler gcc --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json --product $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/.metadata/product.json
SYSCFG_FILES := $(shell $(SYSCFG_CMD_STUB) --listGeneratedFiles --listReferencedFiles --output . ../mcuboot_blinky.syscfg)

SYSCFG_C_FILES = $(filter %.c,$(SYSCFG_FILES))
SYSCFG_H_FILES = $(filter %.h,$(SYSCFG_FILES))
SYSCFG_OPT_FILES = $(filter %.opt,$(SYSCFG_FILES))

OBJECTS = blinky.obj main_nortos.obj mcuboot_config_trace.obj $(patsubst %.c,%.obj,$(notdir $(SYSCFG_C_FILES)))
NAME = mcuboot_blinky

CFLAGS += -I.. \
    -I. \
    $(addprefix @,$(SYSCFG_OPT_FILES)) \
    -O3 \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos/posix" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app/mcuboot_config" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/bootutil/include" \
    -std=c99 \
    -ffunction-sections \
    -fdata-sections \
    -g \
    -gstrict-dwarf \
    -Wall \
    -mcpu=cortex-m4 \
    -march=armv7e-m \
    -mthumb \
    -mfloat-abi=hard \
    -mfpu=fpv4-sp-d16 \
    "-I$(GCC_ARMCOMPILER)/arm-none-eabi/include/newlib-nano" \
    "-I$(GCC_ARMCOMPILER)/arm-none-eabi/include"

LFLAGS += -eresetISR \
    -nostartfiles \
    -static \
    -Wl,--gc-sections \
    -lgcc \
    -lc \
    -lm \
    -lnosys \
    --specs=nano.specs \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-L$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/kernel/nortos" \
    -Wl,-T,../mcuboot_blinky_cc13x2x7_cc26x2x7.lds \
    "-Wl,-Map,$(NAME).map" \
    ti_utils_build_linker.cmd.genlibs \
    -march=armv7e-m \
    -mthumb \
    -mfloat-abi=hard \
    -mfpu=fpv4-sp-d16 \
    "-L$(GCC_ARMCOMPILER)/arm-none-eabi/lib/thumb/v7e-m/hard" \
    --specs=nosys.specs

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).out
	$(GCC_ARMCOMPILER)/bin/arm-none-eabi-objcopy $(NAME).out --output-target binary $(NAME)-noheader.bin --remove-section=.ccfg
	$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tools/common/mcuboot/imgtool sign --header-size 0x80 --align 4 --slot-size 0x56000 --version 1.0.0 --pad-header --pad --key $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/root-ec-p256.pem $(NAME)-noheader.bin $(NAME).bin

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
	@ $(CC) $(CFLAGS) $$< -c -o $$@
endef

$(foreach c_file,$(SYSCFG_C_FILES),$(eval $(call C_RULE,$(c_file))))

blinky.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/blinky_app/blinky.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -c -o $@

main_nortos.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/blinky_app/main_nortos.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -c -o $@

mcuboot_config_trace.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/boot/ti/source/mcuboot_app/mcuboot_config/trace.c $(SYSCFG_H_FILES)
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -c -o $@

$(NAME).out: $(OBJECTS)
	@ echo linking $@
	@ $(LNK)  $(OBJECTS)  $(LFLAGS) -o $(NAME).out

clean:
	@ echo Cleaning...
	@ $(RM) $(OBJECTS) > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).out > $(DEVNULL) 2>&1
	@ $(RM) $(NAME).map > $(DEVNULL) 2>&1
	@ $(RM) $(SYSCFG_FILES)> $(DEVNULL) 2>&1
