## Example Summary

Example that uses the Instrumentation Trace Macrocell (ITM) hardware to write
software instrumentation messages to the PC.

These messages can be read using a suite of tools available in CCS, IAR, or
standalone tools.

## Peripherals Exercised

* `CONFIG_GPIO_LED_0` - Indicates that the board was initialized within `mainThread()`

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

* Use Device Manager to check the value of the XDS110 Class Auxiliary Data
Port. Do not use the "Application/User UART" port. This should be a value
like `COM22`.

* Follow the setup instructions in the "Install tilogger command line tool"
section in `<SDK_INSTALL_DIR>/tools/log/tiutils/Readme.html` to generate a
virtual environment, and to install the required tools.

* Make sure you have started a terminal in the
`<SDK_INSTALL_DIR>/tools/log/tiutils/` folder and activated the virtual
environment from the previous step by running `> ./.venv/Scripts/activate`.
Some terminals will now display an extra note with the prompt
(e.g. `(.venv)` in PowerShell) indicating that a venv is active.

* In the same terminal, start the tool: `tilogger_itm_viewer <PORT> 12000000`
where `<PORT>` is the COM port from the first step (for example
`tilogger_itm_viewer COM22 12000000`).

* Build and flash the example using CCS or another tool. Once the firmware is
flashed, disconnect the debugger. ITM output will not display if the debugger
is connected.
    * __NOTE:__ For CC13X4/26X4 boards, ITM will only output data while a debugger
      *is* connected. For these devices, it is necessary to launch a debug
      session instead of simply flashing the target. While remaining in the
      debug session, the device can be reset to output the reset-frame over ITM
      using the debugger. In CCS this can done from the menu
      `Run -> Reset -> Board Reset (automatic connect/disconnect)`.

* Reset the board. `CONFIG_GPIO_LED_0` turns ON to indicate driver initialization
is complete. The ITM tool will not begin printing until it receives a reset
frame.

* The target will write a string message to the ITM software port:
"Hello World from ITM". Each write to the ITM stream will appear in the tool.
See below for expected output and how this string appears in the data stream.

* A clock function is setup that will update a global variable. This variable's
address is also setup as a DWT watch point. Every time the clock function runs
the variable will update and `CONFIG_GPIO_LED_0` will toggle.

## Expected Output

When running the tool and resetting the board, this is an example of expected
output:

```text
> tilogger_itm_viewer COM62 12000000
INFO:Serial Rx:Serial port \\.\COM62 @ 12000000 opened
SW SWIT at +0, port STIM_DRIVER: 0xBB 0xBB 0xBB 0xBB
SW SWIT at +0, port STIM_RESV0: 0x48 0x65 0x6C 0x6C
TIMESTAMP in sync: + 169 cycles
SW SWIT at +169, port STIM_RESV0: 0x6F 0x20 0x57 0x6F
Unknown/Reserved timestamp header: 16
SW SWIT at +0, port STIM_RESV0: 0x72 0x6C 0x64 0x20
Unknown/Reserved timestamp header: 16
SW SWIT at +0, port STIM_RESV0: 0x66 0x72 0x6F 0x6D
SW SWIT at +0, port STIM_RESV0: 0x20 0x49 0x54 0x4D
SW SWIT at +0, port STIM_RESV0: 0x00
TIMESTAMP packet and timestamp delayed: + 34 cycles
TIMESTAMP in sync: + 1999999 cycles
HW Trace at 1999.999, Read Access, comparator: 0, value : 0x0
TIMESTAMP in sync: + 1030325 cycles
HW Trace at 1030.325, Write Access, comparator: 0, value : 0x1
TIMESTAMP in sync: + 1999999 cycles
HW Trace at 1999.999, Read Access, comparator: 0, value : 0x1
TIMESTAMP in sync: + 1020673 cycles
HW Trace at 1020.673, Write Access, comparator: 0, value : 0x2
TIMESTAMP in sync: + 1999999 cycles
HW Trace at 1999.999, Read Access, comparator: 0, value : 0x2
TIMESTAMP in sync: + 1020757 cycles
HW Trace at 1020.757, Write Access, comparator: 0, value : 0x3
```

First, we can see the reset frame `0xBB 0xBB 0xBB 0xBB`.

Then we see a series of hex values interleaved with timestamps. These values
match the expected hex output for "Hello World from ITM":

```text
 H    e    l    l    o         W    o    r    l    d
0x48 0x65 0x6C 0x6C 0x6F 0x20 0x57 0x6F 0x72 0x6C 0x64 0x20

 f    r    o    m         I    T    M
0x66 0x72 0x6F 0x6D 0x20 0x49 0x54 0x4D 0x00
```

After this we see only the `HW Trace` packets. These are messages from the DWT
Watchpoint module, which is tracking accesses to `variableToWatch`, which is
accessed periodically by `clockTimeoutFunction`.

The lines indicating `Unknown/Reserved timestamp` are a limitation with the
current tooling.

## Host Side Tooling

Several IDEs such as IAR or CCS offer ITM focused tooling. These tools will
configure the ITM registers directly through the debugger. This example
will configure the ITM on device from firmware. For this reason,
this example will not be compatible with these tools as the configuration
settings may clash.

If it is desired to use these tools, it is recommended to comment out any APIs
related to ITM configuration (e.g. `ITM_open`, `ITM_close`, `ITM_enable*`,
`ITM_disable*`) and use `ITM_applyPinMux` directly to mux out the SWO pin.

From there, the settings and configuration of ITM is configured by the IDE.
However the SW message APIs can be used to write to the stimulus ports.

## SysConfig

The ITM driver parameters such as serial format, baudrate, and trace port enable
can be configured in SysConfig. When enabled, the ITM driver will hook into the
Power policy using `ITM_flush` and `ITM_restore` to ensure that all pending
messages are flushed before the device powers down the CPU domain.

## Application Design Details

* This example shows how to initialize the ITM driver and use it to produce
software messages and DWT messages from the target.

* A single thread, `mainThread`, configures and accesses the ITM.

* __NOTE:__ When using any SensorTag(STK) Board, the XDS110 debugger must be
selected with the 4-wire JTAG connection within your projects' debugger
configuration.

FreeRTOS:

* Please view the `FreeRTOSConfig.h` header file for example configuration
information.
