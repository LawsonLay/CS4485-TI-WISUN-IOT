/*
 * Copyright (c) 2022-2024, Texas Instruments Incorporated
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
 *  ======== encrypt.c ========
 */
#include <stdint.h>
#include <string.h>
#include <ti/display/Display.h>
#include <ti/drivers/AESCBC.h>
#include <ti/drivers/cryptoutils/cryptokey/CryptoKeyKeyStore_PSA.h>
#include <ti/drivers/cryptoutils/cryptokey/CryptoKeyKeyStore_PSA_init.h>

#include <ti/devices/DeviceFamily.h>
#include DeviceFamily_constructPath(driverlib/aes.h)

/* Driver configuration */
#include "ti_drivers_config.h"

void *mainThread(void *arg0)
{
    AESCBC_Handle handle;
    AESCBC_OneStepOperation operation;
    AESCBC_Params params;
    CryptoKey cryptoKey;
    int_fast16_t status;
    KeyStore_PSA_KeyFileId keyID;
    KeyStore_PSA_KeyAttributes attributes = KEYSTORE_PSA_KEY_ATTRIBUTES_INIT;
    Display_Handle displayHandle;
    uint_fast8_t i;
    uint32_t id;

    /*
     * For example purposes only. Generate IVs in a non-static way in practice.
     * Test vector 0 from NIST CAPV set CBCMMT128
     */
    uint8_t iv[AES_IV_LENGTH_BYTES] =
        {0x2f, 0xe2, 0xb3, 0x33, 0xce, 0xda, 0x8f, 0x98, 0xf4, 0xa9, 0x9b, 0x40, 0xd2, 0xcd, 0x34, 0xa8};
    uint8_t plaintext[AES_BLOCK_SIZE] =
        {0x45, 0xcf, 0x12, 0x96, 0x4f, 0xc8, 0x24, 0xab, 0x76, 0x61, 0x6a, 0xe2, 0xf4, 0xbf, 0x08, 0x22};
    uint8_t ciphertext[sizeof(plaintext)];
    uint8_t keyingMaterial[AES_128_KEY_LENGTH_BYTES] =
        {0x1f, 0x8e, 0x49, 0x73, 0x95, 0x3f, 0x3f, 0xb0, 0xbd, 0x6b, 0x16, 0x66, 0x2e, 0x9a, 0x3c, 0x17};
    /* The ciphertext should be the following after the encryption operation */
    uint8_t expectedCiphertext[AES_BLOCK_SIZE] =
        {0x0f, 0x61, 0xc4, 0xd4, 0x4c, 0x51, 0x47, 0xc0, 0x3c, 0x19, 0x5a, 0xd7, 0xe2, 0xcc, 0x12, 0xb2};

    Board_init();

    Display_init();
    displayHandle = Display_open(Display_Type_UART, NULL);
    if (displayHandle == NULL)
    {
        /* Display_open() failed */
        while (1) {}
    }

    AESCBC_init();

    AESCBC_Params_init(&params);
    params.returnBehavior = AESCBC_RETURN_BEHAVIOR_POLLING;

    handle = AESCBC_open(0, &params);

    if (handle == NULL)
    {
        /* AESCBC_open() failed */
        while (1) {}
    }

    Display_printf(displayHandle,
                   0,
                   0,
                   "AES Cipher Block Chaining (CBC) mode with Secure/Non-Secure isolation example:\n");

    Display_printf(displayHandle, 0, 0, "Importing volatile key to secure key store...");

    /* Import volatile key */
    KeyStore_PSA_setKeyUsageFlags(&attributes, (KEYSTORE_PSA_KEY_USAGE_DECRYPT | KEYSTORE_PSA_KEY_USAGE_ENCRYPT));
    KeyStore_PSA_setKeyAlgorithm(&attributes, KEYSTORE_PSA_ALG_CBC_NO_PADDING);
    KeyStore_PSA_setKeyType(&attributes, KEYSTORE_PSA_KEY_TYPE_AES);
    KeyStore_PSA_setKeyLifetime(
        &attributes,
        KEYSTORE_PSA_KEY_LIFETIME_FROM_PERSISTENCE_AND_LOCATION(KEYSTORE_PSA_KEY_PERSISTENCE_VOLATILE,
                                                                KEYSTORE_PSA_KEY_LOCATION_LOCAL_STORAGE));

    status = KeyStore_PSA_importKey(&attributes, &keyingMaterial[0], sizeof(keyingMaterial), &keyID);

    if (status != KEYSTORE_PSA_STATUS_SUCCESS)
    {
        Display_printf(displayHandle, 0, 0, "KeyStore_PSA_importKey() failed, status = 0x%x", status);
        return (NULL);
    }

    /* Retrieve the key ID value from the key file ID */
    SET_KEY_ID(id, keyID);
    Display_printf(displayHandle, 0, 0, "  Volatile key was successfully stored with ID = 0x%x.\n", id);

    /* KeyStore_PSA_initKey always returns success */
    (void)KeyStore_PSA_initKey(&cryptoKey, keyID, sizeof(keyingMaterial), NULL);

    AESCBC_OneStepOperation_init(&operation);
    operation.key         = &cryptoKey;
    operation.input       = plaintext;
    operation.output      = ciphertext;
    operation.inputLength = sizeof(plaintext);
    operation.iv          = iv;

    Display_printf(displayHandle, 0, 0, "Performing AES CBC mode encryption with key ID 0x%x...\n", id);
    status = AESCBC_oneStepEncrypt(handle, &operation);

    if (status != AESCBC_STATUS_SUCCESS)
    {
        Display_printf(displayHandle, 0, 0, "AESCBC_oneStepEncrypt() failed, status = 0x%x.", status);
        return (NULL);
    }

    AESCBC_close(handle);

    /* Print output ciphertext */
    Display_printf(displayHandle, 0, 0, "Output ciphertext = ");
    for (i = 0; i < sizeof(ciphertext); i++)
    {
        Display_printf(displayHandle, 0, 0, "0x%02x", ciphertext[i]);
    }

    /* Print expected ciphertext */
    Display_printf(displayHandle, 0, 0, "\nExpected ciphertext = ");
    for (i = 0; i < sizeof(expectedCiphertext); i++)
    {
        Display_printf(displayHandle, 0, 0, "0x%02x", expectedCiphertext[i]);
    }

    /* Compare output ciphertext with the expected */
    if (memcmp(ciphertext, expectedCiphertext, sizeof(ciphertext)) == 0)
    {
        Display_printf(displayHandle, 0, 0, "\nSUCCESS: AES CBC encryption output ciphertext matches the expected.");
    }
    else
    {
        Display_printf(displayHandle, 0, 0, "\nFAILED: AES CBC encryption output ciphertext did not match expected!");
    }

    return (NULL);
}
