## Example Summary

Demonstrates how to use SPI driver in peripheral mode to communicate with
another SimpleLink device.  To run this example successfully, another SimpleLink
device running the `spicontroller` example is required.

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
controller & peripheral devices.

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

* Run the example. `CONFIG_GPIO_LED_0` turns ON to show the example is running.

* Once the controller is running, controller and peripheral devices will
exchange messages in a loop.  While the SPI transaction is taking place,
`CONFIG_GPIO_LED1` will toggle on/off indicating transfers are occuring.  After
a transfer is complete, the messages are printed via UART. The loop is repeated
`MAX_LOOP` times.

Messages should appear as follows:

```text
    Starting the SPI peripheral example
    This example requires external wires to be connected to the header pins. Please see the Board.html for details.

    Peripheral SPI initialized

    Peripheral received: Hello from controller, msg#: 0
    Peripheral received: Hello from controller, msg#: 1
    Peripheral received: Hello from controller, msg#: 2
    Peripheral received: Hello from controller, msg#: 3
    Peripheral received: Hello from controller, msg#: 4
    Peripheral received: Hello from controller, msg#: 5
    Peripheral received: Hello from controller, msg#: 6
    Peripheral received: Hello from controller, msg#: 7
    Peripheral received: Hello from controller, msg#: 8
    Peripheral received: Hello from controller, msg#: 9

    Done
```

## Application Design Details

This application uses a single thread:

`peripheralThread` - waits for controller to open `CONFIG_SPI_CONTROLLER`, opens
`CONFIG_SPI_PERIPHERAL`, creates the peripheral message and prepares a transfer.
The `CONFIG_SPI_PERIPHERAL_READY` pin is pulled low to notify the controller it
is ready. Once the transfer complete, peripheral pulls
`CONFIG_SPI_PERIPHERAL_READY` high, prepares the next transaction and pulls
`CONFIG_SPI_PERIPHERAL_READY` low again.  A total of `MAX_LOOP` SPI transactions
are performed in this manner.

The `peripheralThread` performs the following actions:

1. Before performing transfers, we must make sure both, `spicontroller` &
`spiperipheral` applications are synchronized with each other.  The peripheral
will set `CONFIG_SPI_PERIPHERAL_READY` to 1 to notify the controller it is ready
to synchronize. The peripheral will then wait for the controller to pull
`CONFIG_SPI_CONTROLLER_READY` high in acknowledgment.

2. Waits until controller has opened `CONFIG_SPI_CONTROLLER`.  Controller will
pull `CONFIG_SPI_CONTROLLER_READY` low once it has opened its SPI peripheral.

3. Opens `CONFIG_SPI_PERIPHERAL` in callback mode.

4. Creates a SPI transaction structure and sets txBuffer to `Hello from
peripheral, msg# n`, where n is the iteration number.

5. Toggles `CONFIG_GPIO_LED_1`.

6. Performs the SPI transfer in callback mode.  If the transfer is successful,
`CONFIG_SPI_PERIPHERAL_READY` is pulled low to notify the controller the
peripheral is ready for a transfer and the peripheral waits until the transfer
has completed.  Otherwise, an error message is printed to the UART.

7. Once the transfer is completed, `CONFIG_SPI_PERIPHERAL_READY` is pulled high
to notify controller peripheral is not ready for another transfer.

8. Repeats from step 4 for `MAX_LOOP` iterations.

9. Closes the SPI driver object and terminates execution.

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.
