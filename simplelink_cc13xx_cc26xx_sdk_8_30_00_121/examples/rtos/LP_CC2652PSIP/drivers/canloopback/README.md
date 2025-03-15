## Example Summary

This example uses the CAN driver to perform the following actions:

1) Initialize the CAN driver.

2) Configure CAN external loopback test mode.

3) Transmit a classic CAN message and a CAN FD message with bit rate switching.

4) Verify the received messages match the transmitted messages.

5) Disable loopback test mode to allow reception of messages from other nodes on
   the CAN bus.

Since *external* loopback is utilized, the transmitted CAN messages can be
received by other nodes connected to the CAN bus. All received messages are
printed to the UART.

## Peripherals & Pin Assignments

When this project is built, the SysConfig tool will generate the TI-Driver
configurations into the __ti_drivers_config.c__ and __ti_drivers_config.h__
files. Information on pins and resources used is present in both generated
files. Additionally, the System Configuration file (\*.syscfg) present in the
project may be opened with SysConfig's graphical user interface to determine
pins and resources used.

## BoosterPacks, Board Resources & Jumper Settings

For CC27xx LaunchPads with an integrated CAN controller, this example requires
an external CAN transceiver to receive messages from the CAN bus. Initialization
and configuration of the transceiver is not handled by this example and must be
performed independently. The loopback portion of the example can be run without
a CAN transceiver.

For all other LaunchPads, this example requires a
[__BOOSTXL-CANFD-LIN SPI to CAN FD + LIN BoosterPack__][boostxl-canfd-lin].

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
    * The COM port can be determined via Device Manager in Windows or via
      `ls /dev/tty*` in Linux.

The connection should have the following settings:

```text
    Baud-rate:  115200
    Data bits:       8
    Stop bits:       1
    Parity:       None
    Flow Control: None
```

* Run the example. `CONFIG_GPIO_LED_0` turns ON to indicate driver
initialization is complete.

* The target will print the received CAN message details to the UART.

Sample UART Output:

```text
    Starting CAN Driver Loopback and Receive Demo...

    > Tx Finished: 0x1
    RxMsg Cnt: 1, RxEvt Cnt: 1
    Msg ID: 0x5aa
    TS: 0x0488
    CAN FD: 0
    DLC: 8
    BRS: 0
    ESI: 0
    Data[8]: 00 01 02 03 04 05 06 07

    => PASS: Received message matches transmitted message.


    > Tx Finished: 0x1
    RxMsg Cnt: 2, RxEvt Cnt: 2
    Msg ID: 0x12345678
    TS: 0xb629
    CAN FD: 1
    DLC: 15
    BRS: 1
    ESI: 0
    Data[64]: 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 15 16
    17 18 19 1A 1B 1C 1D 1E 1F 20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
    30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F

    => PASS: Received message matches transmitted message.

    Loopback disabled. Waiting to receive messages from CAN bus...
```

## Application Design Details

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.

[boostxl-canfd-lin]: https://www.ti.com/tool/BOOSTXL-CANFD-LIN
