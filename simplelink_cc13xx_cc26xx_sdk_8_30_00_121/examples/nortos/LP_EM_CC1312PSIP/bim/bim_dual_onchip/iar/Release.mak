CFLAGS += -DBIM_ONCHIP \
    -DxDEBUG_BIM \
    -DBIM_DUAL_ONCHIP_IMAGE \
    -DSECURITY \
    -DxBIM_ERASE_INVALID_IMAGE \
    -DxBIM_BLINK_LED_NO_VALID_IMAGE \
    -DxBIM_VERIFY_VERSION_IMAGE \
    -DxBIM_RESTRICTED_ROLLBACK_VERIFY_COMMIT_IMAGE

LFLAGS += "$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/ti/ble5stack/rom/ble_rom_releases/cc26x2_v2_pg2/Final_Release/ble_rom.symbols"


OBJECTS += Application_sign_util.obj Application_sha2_driverlib.obj

