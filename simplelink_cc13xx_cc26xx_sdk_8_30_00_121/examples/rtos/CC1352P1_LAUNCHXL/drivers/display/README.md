## Example Summary

Uses the Display driver to write output via the XDS110UART and the available
LCD display.

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (\*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

* `CONFIG_GPIO_LED_0` - Toggled by example task periodically
* `CONFIG_Display_UART` - Used to display UART output. Opened by example when
  `Display_open()` is called with the `Display_Type_UART` id
* `CONFIG_Display_LCD` - Used to display LCD output. Opened by example when
  `Display_open()` is called with the `Display_Type_LCD` id

## BoosterPacks, Board Resources & Jumper Settings

This example requires a
[__BOOSTXL-SHARP128 LCD & SD Card BoosterPack__][boostxl-sharp128].

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

* Run the example.

* The string "Hello LCD!" is displayed on the LCD followed by a splash screen.
The string "Hello Serial!" is displayed on UART.

* `CONFIG_GPIO_LED_0` is toggled periodically

* The state of LED0 is output periodically on the UART and the LCD

## Application Design Details

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.

[boostxl-sharp128]: https://www.ti.com/tool/boostxl-sharp128
