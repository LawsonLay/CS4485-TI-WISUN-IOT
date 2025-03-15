/*
 * Copyright (c) 2020-2024, Texas Instruments Incorporated - http://www.ti.com
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * *  Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * *  Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * *  Neither the name of Texas Instruments Incorporated nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 *  ======== log.c ========
 */

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>

#include <time.h>
#include <semaphore.h>
#include <signal.h>
#include <ti/log/Log.h>

#define WORK_INTERVAL (5) /* 5 sec */

static void log_clkFxn();
static uint8_t count = 0;
static sem_t sem;

/*
 *  ======== mainThread ========
 */
void *mainThread(void *arg0)
{
    timer_t clk_s;
    struct sigevent appSev;
    struct itimerspec its;
    int retc;
    uint8_t bufferToLog[] = {0, 1, 2, 3, 4, 5};

    /* Greet the user, send this to all modules */
    Log_printf(LogModule_App1, Log_DEBUG, "Hello World!");
    Log_printf(LogModule_App2, Log_DEBUG, "Hello World!");
    Log_printf(LogModule_App3, Log_DEBUG, "Hello World!");

    /* Send out a buffer that simulates runtime data
     * This function should be used sparingly as it will actually store/send
     * all the the data in the buffer over the log transport
     *
     * However, it is useful for outputting data that not available at compile
     * time. Examples of this include data from RF stacks or serial drivers
     */
    Log_buf(LogModule_App1, Log_DEBUG, "The contents of bufferToLog are: ", bufferToLog, sizeof(bufferToLog));

    retc = sem_init(&sem, 0, 0);
    if (retc != 0)
    {
        Log_printf(LogModule_App1, Log_ERROR, "Semaphore initialization failed, error: %d", retc);
    }

    /* Create the timer that wakes up the thread that will pend on the sem. */
    appSev.sigev_notify            = SIGEV_SIGNAL;
    appSev.sigev_value.sival_ptr   = &sem;
    appSev.sigev_notify_function   = &log_clkFxn;
    appSev.sigev_notify_attributes = NULL;
    retc                           = timer_create(CLOCK_REALTIME, &appSev, &clk_s);
    if (retc != 0)
    {
        Log_printf(LogModule_App1, Log_ERROR, "Timer initialization failed, error: %d", retc);
    }

    /* Set the timer to go off at the period specified by WORK_INTERVAL */
    its.it_interval.tv_sec  = WORK_INTERVAL;
    its.it_interval.tv_nsec = 0;
    its.it_value.tv_sec     = WORK_INTERVAL;
    its.it_value.tv_nsec    = 0;
    retc                    = timer_settime(clk_s, 0, &its, NULL);
    if (retc != 0)
    {
        timer_delete(clk_s);
        Log_printf(LogModule_App1, Log_ERROR, "Failed to set timer period, error: %d", retc);
    }

    while (1)
    {
        retc = sem_wait(&sem);

        /* counter tick event */
        if (retc == 0)
        {
            /* increment application counter */
            count = (count + 1) % 0xFF;

            Log_printf(LogModule_App1, Log_INFO, "count=%d", count);
        }
        else
        {
            Log_printf(LogModule_App1, Log_ERROR, "Failed to pend on semaphore, error: %d", retc);
        }
    }
}

/*
 *  ======== log_clkFxn =======
 */
static void log_clkFxn()
{
    Log_printf(LogModule_App2, Log_VERBOSE, "log_clkFxn: post semaphore");
    Log_printf(LogModule_App3, Log_VERBOSE, "log_clkFxn: post semaphore");
    sem_post(&sem);
}
