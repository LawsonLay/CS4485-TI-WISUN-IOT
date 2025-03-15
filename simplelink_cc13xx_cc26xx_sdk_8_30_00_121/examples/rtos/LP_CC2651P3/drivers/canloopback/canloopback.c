/*
 * Copyright (c) 2023-2024, Texas Instruments Incorporated
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
 *  ======== canloopback.c ========
 */
#include <stdint.h>
#include <stdio.h>
#include <string.h>

/* POSIX Header files */
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

/* Driver Header files */
#include <ti/drivers/CAN.h>
#include <ti/drivers/GPIO.h>
#include <ti/drivers/UART2.h>

/* Driver configuration */
#include "ti_drivers_config.h"

/*
 * Set to 1 to disable printing of Rx'ed CAN messages to UART.
 * The UART prints will increase the Rx message processing
 * time which can result in lost messages at higher messaging
 * frequencies.
 */
#define DISABLE_RX_MSG_PRINT 0

#define THREAD_STACK_SIZE 1024

/* Defines */
#define MAX_MSG_LENGTH 512
#define DLC_TABLE_SIZE 16

#define CAN_EVENT_MASK                                                                                               \
    (CAN_EVENT_RX_DATA_AVAIL | CAN_EVENT_TX_FINISHED | CAN_EVENT_BUS_ON | CAN_EVENT_BUS_OFF | CAN_EVENT_ERR_ACTIVE | \
     CAN_EVENT_ERR_PASSIVE | CAN_EVENT_RX_FIFO_MSG_LOST | CAN_EVENT_RX_RING_BUFFER_FULL |                            \
     CAN_EVENT_BIT_ERR_UNCORRECTED | CAN_EVENT_SPI_XFER_ERROR)

/* Payload bytes indexed by Data Length Code (DLC) field. */
static const uint32_t dlcToDataSize[DLC_TABLE_SIZE] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 24, 32, 48, 64};

/* The following globals are not designated as 'static' to allow CCS IDE access */

/* CAN handle */
CAN_Handle canHandle;

/* UART2 handle */
UART2_Handle uart2Handle;

/* Formatted message buffer */
char formattedMsg[MAX_MSG_LENGTH];

/* Rx and Tx buffer elements */
CAN_RxBufElement rxElem;
CAN_TxBufElement txElem;

/* Received msg count */
uint32_t rxMsgCnt = 0U;

/* Event callback count */
volatile uint32_t rxEventCnt = 0U;

/* Current event */
volatile uint32_t curEvent;

/* Current event data */
volatile uint32_t curEventData;

/* CAN Rx event semaphore */
sem_t rxEventSem;

/* CAN event print semaphore */
sem_t eventPrintSem;

/*
 *  ======== printEvent ========
 */
static void printEvent(void)
{
    if (curEvent == CAN_EVENT_TX_FINISHED)
    {
        sprintf(formattedMsg, "\r\n> Tx Finished: 0x%x\r\n", (unsigned int)curEventData);
    }
    else if (curEvent == CAN_EVENT_BUS_ON)
    {
        sprintf(formattedMsg, "\r\n> Bus On\r\n");
    }
    else if (curEvent == CAN_EVENT_BUS_OFF)
    {
        sprintf(formattedMsg, "\r\n> Bus Off\r\n");
    }
    else if (curEvent == CAN_EVENT_ERR_ACTIVE)
    {
        sprintf(formattedMsg, "\r\n> Error Active\r\n");
    }
    else if (curEvent == CAN_EVENT_ERR_PASSIVE)
    {
        sprintf(formattedMsg, "\r\n> Error Passive\r\n");
    }
    else if (curEvent == CAN_EVENT_RX_FIFO_MSG_LOST)
    {
        sprintf(formattedMsg, "\r\n> Rx FIFO %u message lost\r\n", (unsigned int)curEventData);
    }
    else if (curEvent == CAN_EVENT_RX_RING_BUFFER_FULL)
    {
        sprintf(formattedMsg, "\r\n> Rx ring buffer full: Cnt = %u\r\n", (unsigned int)curEventData);
    }
    else if (curEvent == CAN_EVENT_BIT_ERR_UNCORRECTED)
    {
        sprintf(formattedMsg, "\r\n> Uncorrected bit error\r\n");
    }
    else if (curEvent == CAN_EVENT_SPI_XFER_ERROR)
    {
        sprintf(formattedMsg, "\r\n> SPI transfer error: status = 0x%x\r\n", (unsigned int)curEventData);
    }
    else
    {
        sprintf(formattedMsg, "\r\n> Undefined event\r\n");
    }

    UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);
}

/*
 *  ======== eventPrintThread ========
 */
static void *eventPrintThread(void *arg0)
{
    int retc;

    retc = sem_init(&eventPrintSem, 0, 0);

    if (retc != 0)
    {
        /* sem_init() failed */
        while (1) {}
    }

    while (1)
    {
        /* Wait until event callback posts print semaphore */
        sem_wait(&eventPrintSem);

        printEvent();
    }

    return (NULL);
}

/*
 *  ======== printRxMsg ========
 */
static void printRxMsg(void)
{
    uint_fast8_t dataLen;
    uint_fast8_t i;

    sprintf(formattedMsg, "Msg ID: 0x%x\r\n", (unsigned int)rxElem.id);

    sprintf(formattedMsg + strlen(formattedMsg), "TS: 0x%04x\r\n", rxElem.rxts);

    sprintf(formattedMsg + strlen(formattedMsg), "CAN FD: %u\r\n", rxElem.fdf);

    sprintf(formattedMsg + strlen(formattedMsg), "DLC: %u\r\n", rxElem.dlc);

    sprintf(formattedMsg + strlen(formattedMsg), "BRS: %u\r\n", rxElem.brs);

    sprintf(formattedMsg + strlen(formattedMsg), "ESI: %u\r\n", rxElem.esi);

    if (rxElem.dlc < DLC_TABLE_SIZE)
    {
        dataLen = dlcToDataSize[rxElem.dlc];

        sprintf(formattedMsg + strlen(formattedMsg), "Data[%lu]: ", (unsigned long)dataLen);

        /* Format the message as printable hex */
        for (i = 0U; i < dataLen; i++)
        {
            sprintf(formattedMsg + strlen(formattedMsg), "%02X ", rxElem.data[i]);
        }

        sprintf(formattedMsg + strlen(formattedMsg), "\r\n\n");
    }

    UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);
}

/*
 *  ======== verifyMsg ========
 */
static void verifyMsg(void)
{
    bool verifyErr = false;
    uint_fast8_t dataLen;
    uint_fast8_t i;

    if (rxElem.id != txElem.id)
    {
        sprintf(formattedMsg,
                "=> FAIL: Received ID: 0x%x does not match transmitted ID: 0x%x!\r\n\n",
                (unsigned int)rxElem.id,
                (unsigned int)txElem.id);
        verifyErr = true;
    }
    else if (rxElem.fdf != txElem.fdf)
    {
        sprintf(formattedMsg,
                "=> FAIL: Received FDF: %u does not match transmitted FDF: %u!\r\n\n",
                (unsigned int)rxElem.fdf,
                (unsigned int)txElem.fdf);
        verifyErr = true;
    }
    else if (rxElem.dlc != txElem.dlc)
    {
        sprintf(formattedMsg,
                "=> FAIL: Received DLC: %u does not match transmitted DLC: %u!\r\n\n",
                (unsigned int)rxElem.dlc,
                (unsigned int)txElem.dlc);
        verifyErr = true;
    }
    else if (rxElem.dlc < DLC_TABLE_SIZE)
    {
        dataLen = dlcToDataSize[rxElem.dlc];

        for (i = 0U; i < dataLen; i++)
        {
            if (rxElem.data[i] != txElem.data[i])
            {
                sprintf(formattedMsg,
                        "=> FAIL: Received data[%u]: 0x%02x does not match transmitted data: 0x%02x!\r\n\n",
                        i,
                        rxElem.data[i],
                        txElem.data[i]);
                verifyErr = true;
                break;
            }
        }
    }

    if (!verifyErr)
    {
        sprintf(formattedMsg, "=> PASS: Received message matches transmitted message.\r\n\n");
    }

    UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);
}

/*
 *  ======== processRxMsg ========
 */
static void processRxMsg(bool verify)
{
    /* Read all available CAN messages*/
    while (CAN_read(canHandle, &rxElem) == CAN_STATUS_SUCCESS)
    {
        rxMsgCnt++;

        sprintf(formattedMsg, "RxMsg Cnt: %u, RxEvt Cnt: %u\r\n", (unsigned int)rxMsgCnt, (unsigned int)rxEventCnt);
        UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);

#if !DISABLE_RX_MSG_PRINT
        printRxMsg();
#endif

        if (verify)
        {
            verifyMsg();
        }
    }
}

/*
 *  ======== eventCallback ========
 */
static void eventCallback(CAN_Handle handle, uint32_t event, uint32_t data, void *userArg)
{
    if (event == CAN_EVENT_RX_DATA_AVAIL)
    {
        rxEventCnt++;
        sem_post(&rxEventSem);
    }
    else
    {
        curEvent     = event;
        curEventData = data;
        sem_post(&eventPrintSem);
    }
}

/*
 *  ======== txTestMsg ========
 */
static void txTestMsg(uint32_t id, uint32_t extID, uint32_t dlc, uint32_t fdFormat, uint32_t brsEnable)
{
    uint_fast8_t i;
    int_fast16_t status;

    txElem.id  = id;
    txElem.rtr = 0U;
    txElem.xtd = extID;
    txElem.esi = 0U;
    txElem.brs = brsEnable;
    txElem.dlc = dlc;
    txElem.fdf = fdFormat;
    txElem.efc = 0U;
    txElem.mm  = 1U;

    for (i = 0U; i < dlcToDataSize[txElem.dlc]; i++)
    {
        txElem.data[i] = i;
    }

    status = CAN_write(canHandle, &txElem);
    if (status != CAN_STATUS_SUCCESS)
    {
        /* CAN_write() failed */
        while (1) {}
    }
}

/*
 *  ======== mainThread ========
 */
void *mainThread(void *arg0)
{
    CAN_Params canParams;
    int retc;
    pthread_attr_t attrs;
    pthread_t thread0;
    struct sched_param priParam;
    UART2_Params uart2Params;

    UART2_Params_init(&uart2Params);
    uart2Params.writeMode = UART2_Mode_NONBLOCKING;

    uart2Handle = UART2_open(CONFIG_UART2_0, &uart2Params);

    if (uart2Handle == NULL)
    {
        /* UART2_open() failed */
        while (1) {}
    }

    /* Startup message */
    sprintf(formattedMsg, "\r\nStarting CAN Driver Loopback and Receive Demo...\r\n");
    UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);

    /* Set priority and stack size attributes */
    priParam.sched_priority = 1;

    retc = pthread_attr_init(&attrs);
    retc |= pthread_attr_setschedparam(&attrs, &priParam);
    retc |= pthread_attr_setdetachstate(&attrs, PTHREAD_CREATE_DETACHED);
    retc |= pthread_attr_setstacksize(&attrs, THREAD_STACK_SIZE);
    if (retc != 0)
    {
        /* Failed to set thread attributes */
        while (1) {}
    }

    /* Create event print thread */
    retc = pthread_create(&thread0, &attrs, eventPrintThread, NULL);
    if (retc != 0)
    {
        /* pthread_create() failed */
        while (1) {}
    }

    retc = sem_init(&rxEventSem, 0, 0);
    if (retc != 0)
    {
        /* sem_init() failed */
        while (1) {}
    }

    /* Open CAN driver with default configuration */
    CAN_Params_init(&canParams);
    canParams.eventCbk  = eventCallback;
    canParams.eventMask = CAN_EVENT_MASK;

    canHandle = CAN_open(CONFIG_CAN_0, &canParams);
    if (canHandle == NULL)
    {
        /* CAN_open() failed */
        while (1) {}
    }

    /* Turn on user LED to indicate successful initialization */
    GPIO_write(CONFIG_GPIO_LED_0, CONFIG_GPIO_LED_ON);

    /* Enable external loopback test mode */
    CAN_enableLoopbackExt(canHandle);

    /* Tx classic CAN message */
    txTestMsg(0x5AA, 0U, CAN_DLC_8B, 0U, 0U);
    /* Wait until event callback posts Rx event semaphore */
    sem_wait(&rxEventSem);
    /* Print and verify the received message matches the transmitted */
    processRxMsg(true);

    /* Tx CAN FD message with bit rate switching */
    txTestMsg(0x12345678, 1U, CAN_DLC_64B, 1U, 1U);
    /* Wait until event callback posts Rx event semaphore */
    sem_wait(&rxEventSem);
    /* Print and verify the received message matches the transmitted */
    processRxMsg(true);

    /* Disable loopback to allow messages to be received from the CAN bus */
    CAN_disableLoopback(canHandle);

    sprintf(formattedMsg, "Loopback disabled. Waiting to receive messages from CAN bus...\r\n\n");
    UART2_write(uart2Handle, formattedMsg, strlen(formattedMsg), NULL);

    /* Loop forever */
    while (1)
    {
        /* Wait until event callback posts Rx semaphore */
        sem_wait(&rxEventSem);

        /* Print the received messages only */
        processRxMsg(false);
    }

    return (NULL);
}
