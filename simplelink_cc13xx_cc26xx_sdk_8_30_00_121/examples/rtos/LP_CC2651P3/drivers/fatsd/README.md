## Example Summary

Example to read and write data onto an SD Card with a FAT file system.

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (\*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

* `CONFIG_GPIO_LED_0` - Indicates that the driver was initialized within
`mainThread()`
* `CONFIG_SDFatFS_0` - Connection to SD card

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

* Example output is generated through use of Display driver APIs. Refer to the
Display driver documentation found in the SimpleLink MCU SDK User's Guide.

* Open a serial session (e.g. [`PuTTY`](http://www.putty.org/ "PuTTY's
  Homepage"), etc.) to the appropriate COM port.
    * The COM port can be determined via Device Manager in Windows or via
      `ls /dev/tty*` in Linux.

The connection will have the following settings:

```text
    Baud-rate:     115200
    Data bits:          8
    Stop bits:          1
    Parity:          None
    Flow Control:    None
```

* Run the example. `CONFIG_GPIO_LED_0` turns ON to indicate driver initialization
is complete.

* The example proceeds to read the SD card. If an *input.txt* file is not found,
the file is created on the SD card with the following text:

```text
    "***********************************************************************\n"
    "0         1         2         3         4         5         6         7\n"
    "01234567890123456789012345678901234567890123456789012345678901234567890\n"
    "This is some text to be inserted into the inputfile if there isn't     \n"
    "already an existing file located on the SDCard.                        \n"
    "If an inputfile already exists, or if the file was already once        \n"
    "generated, then the inputfile will NOT be modified.                    \n"
    "***********************************************************************\n"
```

* The *input.txt* file is then read and it's contents are written to a new file
called *output.txt*. If the file already exists on the SD card, it will be
overwritten.

* The contents of the *output.txt* file are then written to the console.

## Application Design Details

* The FatFS source is included and pre-built, together with support for TI-RTOS
or FreeRTOS synchronization. Also included is an implementation of the "device
I/O" model for the TI compiler C runtime support (RTS) library. This provides
transparent support for using the C stdio.h library functions (`fopen`, `fread`,
`fwrite`, etc...) instead of the raw, project-specific, API functions provided
by FatFS (`f_open`, `f_write`).

* This application demonstrates how to use the SD Card driver to read and
write data onto an SD Card using the aforementioned standard CIO runtime
system calls.

* Within the application, the `fatfsPrefix` parameter is used as the namespace
"prefix" for the C RTS fopen() function. See the TI C Compiler User's Guide for
more details. This prefix must be supplied as part of the filename when calling
fopen(). For example, with the default value of "fat", an application would use:

```text
    FILE * fp = fopen("fat:/signal.dat", "w");
```

Additional Features:

* Users also have the option of writing to a RAM disk using either the CIO
runtime system calls or raw FatFS API's. Refer to the FatFS documentation
for more information.

This application uses one thread:

The `mainThread` performs the following actions:

1. Create and initialize the SDFatFS driver object.

2. Open the *input.txt* file. If not found, create the file for reading and
writing. Write the default message to the file.

3. Open the *output.txt* file. Content will be overwritten if found.

4. Copy the contents of *input.txt* to *output.txt*.  Close both files
afterwards.

5. Open *output.txt*, read the file and print the contents using the Display
driver.

6. Close the *output.txt* file and SDFatFS driver, and terminate the example.

### TI-RTOS

* The `timespec` structure must be initialized with the current UNIX seconds
count in order to write files with accurate timestamps. This is due to the fact
that the BIOS Seconds module rather than the RTS library `time()` function
is used.

### FreeRTOS

* The compiler specific RTS library functions for `time()` and `localtime()`
are used. It is not necessary to initialize the `timespec` structure.

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.

### NORTOS

* The timestamp is a constant value, Jan 1 2017 00:00:00.

## References

* The FatFS libraries in this example are configured for use without Long File
Name (VFAT) or XFAT support. If you chose to reconfigure and build FatFS to
include these features, you may be required to license the appropriate patents
from Microsoft.
For more information, please refer to:
<http://elm-chan.org/fsw/ff/en/appnote.html#lfn>

[boostxl-sharp128]: https://www.ti.com/tool/boostxl-sharp128
