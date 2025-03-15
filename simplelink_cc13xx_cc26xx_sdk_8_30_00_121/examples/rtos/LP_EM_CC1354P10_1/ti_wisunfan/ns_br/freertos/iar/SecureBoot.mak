LFLAGS += --config_def SBL_ENABLE=1


# Config-specific post-build commands
.PHONY: postbuild
postbuild: $(NAME).hex
	"$(IAR_ARMCOMPILER)/bin/ielftool" --bin --verbose "./$(NAME).out" ./$(NAME)-noheader.bin
	$(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/tools/common/mcuboot/imgtool sign --header-size 0x80 --align 4 --slot-size 0xA8000 --pad --version 1.0.0 --pad-header --key $(SIMPLELINK_CC13XX_CC26XX_SDK_INSTALL_DIR)/source/third_party/mcuboot/root-ec-p256.pem ./$(NAME)-noheader.bin ./$(NAME).bin
