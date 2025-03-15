## Example Summary

Demonstrates how to use SPI driver in controller mode to communicate with another
SimpleLink device. To run this example successfully, another SimpleLink
device running the `spiperipheral` example is required.

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (\*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

* `CONFIG_SPI_CONTROLLER` - SPI peripheral assigned as a controller
* `CONFIG_SPI_CONTROLLER_READY` - GPIO managed by controller to notify the
peripheral `CONFIG_SPI_CONTROLLER` has been opened
* `CONFIG_SPI_PERIPHERAL_READY` - GPIO to notify the controller the peripheral
is ready for a transfer
* `CONFIG_GPIO_LED_0` - Indicator LED
* `CONFIG_GPIO_LED_1` - Indicator LED

## BoosterPacks, Board Resources & Jumper Settings

This example requires two LaunchPads.

For board specific jumper settings, resources and BoosterPack modifications,
refer to the __Board.html__ file.

> If you're using an IDE such as Code Composer Studio (CCS) or IAR, please
refer to Board.html in your project directory for resources used and
board-specific jumper settings.

The Board.html can also be found in your SDK installation:

```text
<SDK_INSTALL_DIR>/source/ti/boards/<BOARD>
```

Before running the example the following pins must be connected between
controller and peripheral devices.

  |     SPI Controller LaunchPad      |      SPI Peripheral LaunchPad     |
  |:---------------------------------:|:---------------------------------:|
  | __`CONFIG_SPI_CONTROLLER_CLK`__   | __`CONFIG_SPI_PERIPHERAL_CLK`__   |
  | __`CONFIG_SPI_CONTROLLER_PICO`__  | __`CONFIG_SPI_PERIPHERAL_PICO`__  |
  | __`CONFIG_SPI_CONTROLLER_POCI`__  | __`CONFIG_SPI_PERIPHERAL_POCI`__  |
  | __`CONFIG_SPI_CONTROLLER_CSN`__   | __`CONFIG_SPI_PERIPHERAL_CS`__    |
  | __`CONFIG_SPI_CONTROLLER_READY`__ | __`CONFIG_SPI_CONTROLLER_READY`__ |
  | __`CONFIG_SPI_PERIPHERAL_READY`__ | __`CONFIG_SPI_PERIPHERAL_READY`__ |

* The SPI can be used in 4-pin or 3-pin modes (chip select is optional).  When
running this example SPI peripherals on both SimpleLink devices must align on
chip select use.  Users must verify before running the example.

* Although not in the table above, a ground jumper must also be connected
between both boards.

## Example Usage

* Example output is generated through use of Display driver APIs. Refer to the
Display driver documentation found in the SimpleLink MCU SDK User's Guide.

* Open a serial session (e.g. [`PuTTY`](http://www.putty.org/ "PuTTY's
Homepage"), etc.) to the appropriate COM port.
    * The COM port can be determined via Device Manager in Windows or via `ls /dev/tty*` in Linux.

The connection will have the following settings:

```text
    Baud-rate:     115200
    Data bits:          8
    Stop bits:          1
    Parity:          None
    Flow Control:    None
```

* Run the example. `CONFIG_GPIO_LED_0` turns ON to show the example is running

* Once the peripheral is running, controller and peripheral devices will
exchange messages in a loop.  While the SPI transactions are taking place,
`CONFIG_GPIO_LED_1` will toggle on/off indicating transfers are occurring. After
a transfer is complete, the messages are printed via UART. The loop is repeated
`MAX_LOOP` times.

Messages should appear as follows:

```text
    Starting the SPI controller example
    This example requires external wires to be connected to the header pins. Please see the Board.html for details.

    Controller SPI initialized

    Controller received: Hello from peripheral, msg#: 0
    Controller received: Hello from peripheral, msg#: 1
    Controller received: Hello from peripheral, msg#: 2
    Controller received: Hello from peripheral, msg#: 3
    Controller received: Hello from peripheral, msg#: 4
    Controller received: Hello from peripheral, msg#: 5
    Controller received: Hello from peripheral, msg#: 6
    Controller received: Hello from peripheral, msg#: 7
    Controller received: Hello from peripheral, msg#: 8
    Controller received: Hello from peripheral, msg#: 9

    Done
```

## Application Design Details

This application uses a single thread:

`controllerThread` - creates the controller SPI message, opens
`CONFIG_SPI_CONTROLLER` and waits for the peripheral to be ready for a SPI
transfer.  When the peripheral is ready it starts the transfer.  Once complete,
the controller prepares the next transaction and waits for the peripheral once
more.  A total of `MAX_LOOP` SPI transactions are performed in this manner.

The `controllerThread` performs the following actions:

1. Before performing transfers, we must make sure the `spicontroller` and
`spiperipheral` applications are synchronized with each other.  The controller
will set `CONFIG_SPI_CONTROLLER_READY` to 1 to notify the peripheral it is ready
to synchronize. The controller will then wait for the peripheral to set
`CONFIG_SPI_PERIPHERAL_READY` to 1 in acknowledgment.

2. Opens `CONFIG_SPI_CONTROLLER` and sets `CONFIG_SPI_CONTROLLER_READY` to 0.
Setting `CONFIG_SPI_CONTROLLER_READY` will notify the peripheral
`CONFIG_SPI_CONTROLLER` has been opened.

3. Waits for the peripheral to be ready for the SPI transfer.  The peripheral
will pull `CONFIG_SPI_PERIPHERAL_READY` low when ready for a transfer.

4. Creates a SPI transaction structure and sets txBuffer to `Hello from
controller, msg# n`, where n is the iteration number.

5. Toggles `CONFIG_GPIO_LED_1`.

6. Transfers the message. If the transfer is successful, the message
received from the peripheral SPI is printed. Otherwise, an error message
is printed.

7. Sleeps for 3 seconds.

8. Repeats from step 3 for `MAX_LOOP` iterations.

9. Closes the SPI driver object and terminates execution.

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.
