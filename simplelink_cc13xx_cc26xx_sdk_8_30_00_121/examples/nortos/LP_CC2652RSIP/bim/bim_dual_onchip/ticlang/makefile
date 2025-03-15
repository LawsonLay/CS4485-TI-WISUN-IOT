SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"
LNK = "$(TICLANG_ARMCOMPILER)/bin/tiarmclang"

OBJECTS = Application_bim_dual_onchip_main.obj Application_ccfg_app.obj Application_bim_util.obj Application_crc32.obj Application_led_debug.obj Application_flash_interface_internal.obj SPI_bsp_spi_cc13x2_cc26x2.obj Application_startup_ticlang.obj
NAME = bim_dual_onchip

# Each config-specific .mak file will initialize appropriate options (AFLAGS, CFLAGS, LFLAGS),
# which will then be appended to below.
CONFIG := RELEASE
ifeq ($(CONFIG), RELEASE)
	include Release.mak
else ifeq ($(CONFIG), DEBUG)
	include Debug.mak
endif

CFLAGS += -I.. \
    -Oz \
    -mlittle-endian \
    -fshort-enums \
    -munaligned-access \
    -funsigned-char \
    -fcommon \
    -ffunction-sections \
    -fdata-sections \
    -std=gnu9x \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/startup_files" \
    -DSET_CCFG_IMAGE_VALID_CONF_IMAGE_VALID=0x56000 \
    -DDeviceFamily_CC26X2 \
    -gdwarf-3 \
    -mcpu=cortex-m4 \
    -march=armv7e-m \
    -mthumb \
    -mfloat-abi=hard \
    -mfpu=fpv4-sp-d16

LFLAGS += -Wl,--stack_size=256 \
    -Wl,--unused_section_elimination=on \
    -Wl,--diag_wrap=off \
    "-Wl,--xml_link_info=$(NAME)_linkInfo.xml" \
    -Wl,--warn_sections \
    -L. \
    "-l$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/driverlib/bin/ticlang/driverlib.lib" \
    ../bim_cc26x2_cc13x2.cmd \
    "-Wl,-m,$(NAME).map" \
    -Wl,--rom_model \
    "-L$(TICLANG_ARMCOMPILER)/lib" \
    -llibc.a

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).out
	$(TICLANG_ARMCOMPILER)/bin/tiarmhex -order MS --memwidth=8 --romwidth=8 --intel -o $(NAME).hex $(NAME);

Application_bim_dual_onchip_main.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/bim/dual/bim_dual_onchip_main.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_ccfg_app.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/bim/ccfg_app.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_bim_util.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/bim/bim_util.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_crc32.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/crc/crc32.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_led_debug.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/debug/led_debug.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_sign_util.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/ecc/sign_util.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_sha2_driverlib.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/sha2/sha2_driverlib.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_flash_interface_internal.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/flash_interface/internal/flash_interface_internal.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

SPI_bsp_spi_cc13x2_cc26x2.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/flash/no_rtos/extFlash/bsp_spi_cc13x2_cc26x2.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) -c $< -o $@

Application_startup_ticlang.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/startup_files/startup_ticlang.c
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
