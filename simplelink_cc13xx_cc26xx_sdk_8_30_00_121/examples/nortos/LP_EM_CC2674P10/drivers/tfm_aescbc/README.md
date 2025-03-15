---
# AES Cipher Block Chaining (CBC) mode with Secure/Non-Secure isolation

---

## Example Summary

Simple example of Secure/Non-Secure isolation where a volatile key is imported
to the Key Store and used to encrypt a pre-defined plaintext message using AES
Cipher Block Chaining (CBC) to verify correct operation.

### Disclaimer

This demo is not designed for use in production and is only a demonstration of
how to manipulate the APIs of the various crypto drivers. Please evaluate the
specific security requirements of your product and domain and consult with
security experts before deploying critical code in the field. This example is
not appropriate for a final product and does not provide any guarantee of
security if utilized.

### Cryptography Drivers

* `CONFIG_AESCBC_0` - One-step encryption and decryption for encrypted packets

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (/*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

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

* Open a serial session (e.g. [`PuTTY`](http://www.putty.org/ "PuTTY's
 Homepage"), etc.) to the appropriate COM port.
    * The COM port can be determined via Device Manager in Windows or via `ls
     /dev/tty*` in Linux.

The connection will have the following settings:

```text
    Baud-rate:     115200
    Data bits:          8
    Stop bits:          1
    Parity:          None
    Flow Control:    None
```

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
   Select the NS application `tfm_aescbc_XXXX.out`.
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
   Select the NS application `tfm_aescbc_XXXX.out`.
  6. Execution should be suspended at `Reset_Handler()` if the above steps were
   done correctly.
  7. Set breakpoints if desired and resume execution to run the example.

* Steps to run the example with IAR:
  1. This example is not currently supported for IAR.

## Application Design Details

* The main application runs in `encrypt.c`. The Encryption itself runs
  automatically once in a separate Encryption Task. It will encrypt the
  statically defined plaintext using `AESCBC_oneStepEncrypt`. The Encryption
  output is then compared to a statically defined expected output. When
  complete, the task exits. If any errors occur, the application will stop
  in a while loop.

Security and TrustZone:

* Refer to the `TI Trusted Firmware-M User Guide` in `docs/tfm` for
general information on using security features.

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
  information.
