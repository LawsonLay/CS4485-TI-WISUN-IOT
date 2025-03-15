CFLAGS += -DBOOT_LOADER \
    -DxFLASH_DEVICE_ERASE \
    -DSECURITY \
    -DDEBUG_BIM

LFLAGS += "-l$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/rom/ble_rom_releases/cc26x2_v2_pg2/Final_Release/ble_rom.symbols"


OBJECTS += Application_sign_util.obj

