
# Log Example

This example shows how to instrument your source code using `Log`, as well as
using the respective tools to capture and view log output from the target.

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

If using a CC13XX/26XX LaunchPad, the SWO jumper must be mounted for this
example.

* __NOTE:__ For CC13X4/26X4 boards, ITM will only output data while a debugger is
connected. For these devices, it is necessary to launch a debug session instead
of simply flashing the target and running it. While remaining in the debug
session, the device can be reset to output the reset-frame over ITM using the
debugger. In CCS this can be done from the menu `Run -> Reset`. The reset-frame
is required for the tilogger tool to start parsing.
* __NOTE:__ If LogSinkUART is used, there is no need to reset the device to start
parsing logs via the tilogger tool.

## Definitions

The following terms are used throughout the Readme.

| Term                            | Definition                                                                                                                                                                                                                                                          |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LogModule`                     | A parameter passed to Log APIs to indicate which software module the log statement originated from. Modules also control the routing of logs to sinks.                                                                                                              |
| `LogLevel`                      | The severity or importance of a given log statement.                                                                                                                                                                                                                |
| `Sink`                          | Also simply called a logger. This is a transport specific logger implementation. <br> The Logging framework is flexible such that multiple sinks may exist in a single firmware image.                                                                              |
| `CallSite`                      | A specific invocation of a Log API in a given file or program.                                                                                                                                                                                                      |
| `Record`                        | The binary representation of a log when it is stored or transported by a given sink. The log record format varys slightly with each sink depending on their implementation and needs. However, they all convey the same information.                                |
| `Link Time Optimization (LTO)`  | A feature of some toolchains that can significantly reduce the code overhead of the log statements through a process called dead code elimination. In order to maximize the benefits of this, all static libraries and application files should have LTO enabled.   |

### Highlights

This example

* Exercises the Logging API showing common use cases.
* Uses three separate LogModules
    * `LogModule_App1` uses the default sink LogSinkBuf which routes logs to
      memory
    * `LogModule_App2` is a second module that routes logs to UART
    * `LogModule_App3` is a third module that routes logs to ITM on devices
      which supports it, and otherwise to memory using the same LogSinkBuf as
      `LogModule_App1`
* Exercises the UART, ITM and buffer loggers (`LogSinkUART`, `LogSinkITM`,
  `LogSinkBuf`).
* Runs a task which wakes up every 5 seconds.

__NOTE:__ LogSinkBuf requires Runtime Object View (ROV) which is
currently not available in IAR and CCS Theia.__ Thus, there is no proper
visualizer for these messages besides inspecting their records in memory. Also,
when LTO is enabled, the compiler will make ROV unable to find the right state
variables to read out the log records from SRAM. The UART and ITM transports are
supported across all IDEs/toolchains.

### Overview

The example uses three log modules that each use a different log sink.

The routing of the log data is controlled by the relevant LogModule instance in
SysConfig. This routing is controlled at the module level. That is,
all log data from a given module goes to the same log sink. Each LogModule can
also be individually configured to be enabled or not, and the settings for each
log sink can also be configured.

Visualization of logs depends on their transport. This is discussed in the
following section.

## Log Visualization

Each log module is routed to a different log sink.
Due to the differing nature of the transport mechanisms used by the backend
delegates, they are visualized using different methods. The table below shows
the tooling used for visualizing the different types of logs.

| Logger        | Transport | Visualization tool                    |
|---------------|-----------|---------------------------------------|
| `LogSinkBuf`  | memory    | Runtime Object View (ROV)             |
| `LogSinkUART` | UART      | TI Python Backend + stdout/Wireshark  |
| `LogSinkITM`  | ITM       | TI Python Backend + stdout/Wireshark  |

The log statements can be viewed independently. It is not required to have
both host side tools running in order for the example to run. For more
information on the host side tools, see README.md in
`<SDK_INSTALL_DIR>/tools/log/tiutils`.

 __NOTE:__ When using the tilogger host side tool, please  make sure it is
 up-to-date to avoid compatibility issues.

## Example Usage

This demo illustrates a working example of logging. Since this example uses
SysConfig, initialization of the log sinks is automatically handled in
`Board_init()`.

__NOTE:__ If you are not using SysConfig, remember to include the sink's header
file and call the corresponding `LogSink*_init()` before calling other
Log_ APIs.

In this example LogSinkBuf, LogSinkUART and LogSinkITM are used.
Please refer to the documentation of the particular log sink for more
information on usage.

### Import and Build the Example

1. Import the project into your workspace.

1. Build the project.

### Load and Run the Program

1. Follow the steps in the "Quick Start Guide" section of the readme in
   `<SDK_INSTALL_DIR>/tools/log/tiutils` to setup the logger tool.

1. Load the program.

1. To view LogSinkBuf statements: Launch ROV while in a debug session.

    ```text
    Tools -> Runtime Object View
    ```

    Open the ROV `LogSinkBuf` view

    ```text
    Tools > Runtime Object View
    Connect
    LogSinkBuf
    LogSinkBuf > Records
    ```

    Enable continuous refresh to see the output as it is generated.
    The default refresh rate is 1 second.

1. To view LogSinkUART or LogSinkITM statements: Follow the steps in the
   "Extracting Logs" section of the readme in
   `<SDK_INSTALL_DIR>/tools/log/tiutils`.

1. Run the program.

    In ROV, you will see the initial start up message, followed by a count
    update every 5 seconds.

    ```text
    count=1
    count=2
    count=3
    ```

    Using LogSinkUART or LogSinkITM, you will see the initial start up message
    (Hello world) in Wireshark or stdout, and messages whenever the
    application's semaphore is posted.

    ```text
    log_clkFxn: post semaphore
    ...
    ```

## Conditional Log Inclusion

Log invocations are conditionally included in the final program based on the
settings of the corresponding log module, if link-time optimization is enabled.
If the log module is disabled, or the log-level for the particular invocation is
insufficient, the linker will perform dead-code elimination, and optimize the
call away.

It is therefore recommended to build with link time optimization if the
toolchain supports it.

## Source Code Instrumentation

To add instrumentation to your source code, requires three steps:

1. Include Log.h
2. Define a log module name
3. Add an instrumentation call site

In log.c, you will see the following code which prints a greeting:

```c
#include <ti/log/Log.h>

Log_printf(LogModule_App1, Log_DEBUG, "Hello World!");
Log_printf(LogModule_App2, Log_DEBUG, "Hello World!");
Log_printf(LogModule_App3, Log_DEBUG, "Hello World!");
```

The above code will implicitly declare a log module called LogModule_App1.
This means that a logModule called LogModule_App1 must be defined, most easily
by SysConfig. The log data associated with this log module will be routed to the
logger instance specified by LogModule_App1.

## Adding Modules

All log statements in the above example use either LogModule_App1,
LogModule_App2 or LogMudule_App3. Log modules are useful for grouping and
sorting log statements that share configrations such as severity levels and
sinks. In order to create a new module follow the steps below:

1. Define a module name
1. Create a Log module in SysConfig with the given name
1. Configure the Log module to use a desired sink, and set log levels

## SysConfig

Open the Logging category. You will find the following modules:

* Log Modules - a list of all defined log modules, along with their respective
  configurations
* Log Sinks - this lists all available sinks that logs can be routed to
* LogSinkBuf - all instances of LogSinkBuf. Each instances is a seperate memory
  area that logs can be written to. Each sink can be configured separately.
* LogSinkUART - depending on the device, there may be more than one available
  UART sink.
* LogSinkITM - due to hardware limitations, there is only one available ITM
  sink. However, several different modules may use it as a sink.

## Feedback

Please report issues or feedback to [__E2E__][e2e].

[e2e]: https://e2e.ti.com/
