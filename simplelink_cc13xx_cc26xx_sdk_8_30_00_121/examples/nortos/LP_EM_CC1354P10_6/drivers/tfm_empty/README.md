## Example Summary

This example is intended to be a starting point for new development where
a fuller set of kernel features and debug capabilities are enabled.

The project is configured to use the non-secure linker files and libraries.
To use this project, you will also need to flash the secure image to the
device.

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (\*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

* `CONFIG_GPIO_LED_0`

## BoosterPacks, Board Resources & Jumper Settings

For board specific jumper settings, resources and BoosterPack modifications,
refer to the __Board.html__ file.

> If you're using an IDE such as Code Composer Studio (CCS) or IAR, please
refer to Board.html in your project directory for resources used and
board-specific jumper settings.

The Board.html can also be found in your SDK installation:

```text
<SDK_INSTALL_DIR>/source/ti/boards/<BOARD>
```

## Example Usage

* Steps to run the example with CCS:
  1. Launch the CCS debug session.
  2. Select *Tools* -> *Debugger Options* -> *Auto Run and Launch Options*.
   Disable Auto Run Option "On a program load or restart". Set "Remember My
   Settings" to allow this setting to persist for subsequent debug sessions.
  3. Exit and relaunch the debug session. Execution should be suspended at
   `_c_int00()` or `ResetISR()`. Steps 2 & 3 can be skipped for subsequent
   debug sessions.
  4. Select *Run* -> *Load* -> *Load Program*.  Select `tfm_s.axf` located in
   `<SDK_INSTALL_DIR>/tfm_s/build/cc26x4/production_full/Release/bin/` to
   program the Secure image.  This will overwrite the NS application symbols.
  5. To restore NS application symbols: Select *Run* -> *Load* -> *Add Symbols*.
   Select the NS application `tfm_empty_XXXX.out`.
  6. Execution should be suspended at `Reset_Handler()` if the above steps were
   done correctly.
  7. Set breakpoints if desired and resume execution to run the example.

* Steps to run the example with CCS Theia:
  1. Open the project properties, select __Debug__. Select "Cortex_M33_0" for the
   *Core* and "Auto Run and Launch Options" for the *Category*. Disable Auto Run
   Option "On a program load or restart".
  2. Launch the CCS debug session.
  3. Execution should be suspended at `_c_int00()` or `ResetISR()`.
  4. Select *Run* -> *Load* -> *Load Program*.  Select `tfm_s.axf` located in
   `<SDK_INSTALL_DIR>/tfm_s/build/cc26x4/production_full/Release/bin/` to
   program the Secure image.  This will overwrite the NS application symbols.
  5. To restore NS application symbols: Select *Run* -> *Load* -> *Add Symbols*.
   Select the NS application `tfm_empty_XXXX.out`.
  6. Execution should be suspended at `Reset_Handler()` if the above steps were
   done correctly.
  7. Set breakpoints if desired and resume execution to run the example.

* Steps to run the example with IAR:
  1. This example is not currently supported for IAR.

* The example lights `CONFIG_GPIO_LED_0` as part of the initialization in the
`mainThread()`. This thread then toggles the LED at a 1 second rate.

## Application Design Details

Security and TrustZone:

* Refer to the `TI Trusted Firmware-M User Guide` in `docs/tfm for
general information on using security features.

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.
