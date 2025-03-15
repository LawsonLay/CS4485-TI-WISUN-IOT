SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR ?= $(abspath ../../../../../..)

include $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/imports.mak

CC = "$(IAR_ARMCOMPILER)/bin/iccarm"
LNK = "$(IAR_ARMCOMPILER)/bin/ilinkarm"

OBJECTS = Application_bim_offchip_main.obj Application_ccfg_app.obj Application_bim_util.obj Application_crc32.obj Application_led_debug.obj Application_flash_interface_internal.obj ExternalFlash_ext_flash.obj SPI_bsp_spi_cc13x2_cc26x2.obj Application_startup_iar.obj
NAME = bim_offchip

# Each config-specific .mak file will initialize appropriate options (AFLAGS, CFLAGS, LFLAGS),
# which will then be appended to below.
CONFIG := DEBUG_UNSECURE
ifeq ($(CONFIG), DEBUG_UNSECURE)
	include Debug_unsecure.mak
else ifeq ($(CONFIG), RELEASE_UNSECURE)
	include Release_unsecure.mak
else ifeq ($(CONFIG), RELEASE)
	include Release.mak
else ifeq ($(CONFIG), DEBUG)
	include Debug.mak
endif

CFLAGS += -I.. \
    -Ohz \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source" \
    "-I$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/startup_files" \
    -DSET_CCFG_IMAGE_VALID_CONF_IMAGE_VALID=0x56000 \
    -DSET_CCFG_MODE_CONF_XOSC_CAP_MOD=0x0 \
    -DSET_CCFG_MODE_CONF_XOSC_CAPARRAY_DELTA=-63 \
    -DDeviceFamily_CC13X2 \
    --debug \
    --silent \
    -e \
    --aeabi \
    --thumb \
    --diag_suppress=Pa050 \
    --cpu Cortex-M4 \
    --fpu=VFPv4_sp \
    --vla

LFLAGS += --config_def xPAGE_ALIGN=1 \
    --inline \
    "$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/driverlib/bin/iar/driverlib.lib" \
    --config ../bim_cc26x2_cc13x2.icf \
    --map "$(NAME).map" \
    --silent \
    --semihosting=iar_breakpoint \
    --cpu=Cortex-M4 \
    --fpu=VFPv4_sp

all: postbuild

.PHONY: postbuild
postbuild: $(NAME).out
	"$(IAR_ARMCOMPILER)/bin/ielftool" --ihex --verbose "./$(NAME).out" "./$(NAME).hex" 

Application_bim_offchip_main.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/bim/bim_offchip_main.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_ccfg_app.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/bim/ccfg_app.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_bim_util.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/bim/bim_util.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_crc32.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/crc/crc32.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_led_debug.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/debug/led_debug.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_sign_util.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/ecc/sign_util.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_sha2_driverlib.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/sha2/sha2_driverlib.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_flash_interface_internal.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/cc26xx/flash_interface/internal/flash_interface_internal.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

ExternalFlash_ext_flash.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/flash/no_rtos/extFlash/ext_flash.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

SPI_bsp_spi_cc13x2_cc26x2.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/common/flash/no_rtos/extFlash/bsp_spi_cc13x2_cc26x2.c
	@ echo Building $@
	@ $(CC) $(CFLAGS) $< -o $@

Application_startup_iar.obj: $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/devices/cc13x2_cc26x2/startup_files/startup_iar.c
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
