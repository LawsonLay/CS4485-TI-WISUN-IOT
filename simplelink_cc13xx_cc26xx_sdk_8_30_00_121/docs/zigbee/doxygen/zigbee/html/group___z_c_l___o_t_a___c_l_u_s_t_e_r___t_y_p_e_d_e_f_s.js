var group___z_c_l___o_t_a___c_l_u_s_t_e_r___t_y_p_e_d_e_f_s =
[
    [ "zclOTA_ImageNotifyParams_t", "structzcl_o_t_a___image_notify_params__t.html", [
      [ "fileId", "structzcl_o_t_a___image_notify_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "payloadType", "structzcl_o_t_a___image_notify_params__t.html#a8db388eca52b48929c4dc8f2efbc488f", null ],
      [ "queryJitter", "structzcl_o_t_a___image_notify_params__t.html#a0738aa0111bee8ef7ea1e0ee9dd3f9f9", null ]
    ] ],
    [ "zclOTA_QueryNextImageReqParams_t", "structzcl_o_t_a___query_next_image_req_params__t.html", [
      [ "fieldControl", "structzcl_o_t_a___query_next_image_req_params__t.html#ab4c0464630afe131bc4a76ea5c70a96d", null ],
      [ "fileId", "structzcl_o_t_a___query_next_image_req_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "hardwareVersion", "structzcl_o_t_a___query_next_image_req_params__t.html#a22d9cb26134a18deaf9245c6da2e2887", null ]
    ] ],
    [ "zclOTA_QueryImageRspParams_t", "structzcl_o_t_a___query_image_rsp_params__t.html", [
      [ "fileId", "structzcl_o_t_a___query_image_rsp_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "imageSize", "structzcl_o_t_a___query_image_rsp_params__t.html#ab1ce8bb44bc98a61115233a58117c2ad", null ],
      [ "status", "structzcl_o_t_a___query_image_rsp_params__t.html#ade818037fd6c985038ff29656089758d", null ]
    ] ],
    [ "zclOTA_ImageBlockReqParams_t", "structzcl_o_t_a___image_block_req_params__t.html", [
      [ "blockReqDelay", "structzcl_o_t_a___image_block_req_params__t.html#ac86ffd81dd417dcea685c3f7ace7508e", null ],
      [ "fieldControl", "structzcl_o_t_a___image_block_req_params__t.html#ab4c0464630afe131bc4a76ea5c70a96d", null ],
      [ "fileId", "structzcl_o_t_a___image_block_req_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "fileOffset", "structzcl_o_t_a___image_block_req_params__t.html#a1547544742649b0f1d4f3cba8ac85a5e", null ],
      [ "maxDataSize", "structzcl_o_t_a___image_block_req_params__t.html#a9d9185c93e53b9314c5190d2b854e402", null ],
      [ "nodeAddr", "structzcl_o_t_a___image_block_req_params__t.html#ad492a9e9eaae85d95defc11116cac77c", null ]
    ] ],
    [ "zclOTA_ImagePageReqParams_t", "structzcl_o_t_a___image_page_req_params__t.html", [
      [ "fieldControl", "structzcl_o_t_a___image_page_req_params__t.html#ab4c0464630afe131bc4a76ea5c70a96d", null ],
      [ "fileId", "structzcl_o_t_a___image_page_req_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "fileOffset", "structzcl_o_t_a___image_page_req_params__t.html#a1547544742649b0f1d4f3cba8ac85a5e", null ],
      [ "maxDataSize", "structzcl_o_t_a___image_page_req_params__t.html#a9d9185c93e53b9314c5190d2b854e402", null ],
      [ "nodeAddr", "structzcl_o_t_a___image_page_req_params__t.html#ad492a9e9eaae85d95defc11116cac77c", null ],
      [ "pageSize", "structzcl_o_t_a___image_page_req_params__t.html#a02cd0d33bf95da0a4437c4fecbcccd05", null ],
      [ "responseSpacing", "structzcl_o_t_a___image_page_req_params__t.html#a8bd7889b4643c63b68865bc2d3427582", null ]
    ] ],
    [ "imageBlockRspSuccess_t", "structimage_block_rsp_success__t.html", [
      [ "dataSize", "structimage_block_rsp_success__t.html#af13e629a2f79d14821c7b9246ef99e9f", null ],
      [ "fileId", "structimage_block_rsp_success__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "fileOffset", "structimage_block_rsp_success__t.html#a1547544742649b0f1d4f3cba8ac85a5e", null ],
      [ "pData", "structimage_block_rsp_success__t.html#a77f0d5374ee675db57c0b29946ca7744", null ]
    ] ],
    [ "imageBlockRspWait_t", "structimage_block_rsp_wait__t.html", [
      [ "blockReqDelay", "structimage_block_rsp_wait__t.html#ac86ffd81dd417dcea685c3f7ace7508e", null ],
      [ "currentTime", "structimage_block_rsp_wait__t.html#ad4c3dbcb408adf7386297aac9025571a", null ],
      [ "requestTime", "structimage_block_rsp_wait__t.html#a4095c62b6f71dc7ab468208c8324f83e", null ]
    ] ],
    [ "imageBlockRsp_t", "unionimage_block_rsp__t.html", [
      [ "success", "unionimage_block_rsp__t.html#aa10c33b2b3cd3f6f3a749d49c23635ef", null ],
      [ "wait", "unionimage_block_rsp__t.html#a6b22855845ed747173281f60c66e9eec", null ]
    ] ],
    [ "zclOTA_ImageBlockRspParams_t", "structzcl_o_t_a___image_block_rsp_params__t.html", [
      [ "rsp", "structzcl_o_t_a___image_block_rsp_params__t.html#ae9df1c9b0697a5410433a6dcc3051304", null ],
      [ "status", "structzcl_o_t_a___image_block_rsp_params__t.html#ade818037fd6c985038ff29656089758d", null ]
    ] ],
    [ "zclOTA_UpgradeEndReqParams_t", "structzcl_o_t_a___upgrade_end_req_params__t.html", [
      [ "fileId", "structzcl_o_t_a___upgrade_end_req_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "status", "structzcl_o_t_a___upgrade_end_req_params__t.html#ade818037fd6c985038ff29656089758d", null ]
    ] ],
    [ "zclOTA_UpgradeEndRspParams_t", "structzcl_o_t_a___upgrade_end_rsp_params__t.html", [
      [ "currentTime", "structzcl_o_t_a___upgrade_end_rsp_params__t.html#ad4c3dbcb408adf7386297aac9025571a", null ],
      [ "fileId", "structzcl_o_t_a___upgrade_end_rsp_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "upgradeTime", "structzcl_o_t_a___upgrade_end_rsp_params__t.html#ab25ae7a306a0f5c1e907341f2c444e7d", null ]
    ] ],
    [ "zclOTA_QuerySpecificFileReqParams_t", "structzcl_o_t_a___query_specific_file_req_params__t.html", [
      [ "fileId", "structzcl_o_t_a___query_specific_file_req_params__t.html#a5b2418bee719449086cf0de0c7f01f9e", null ],
      [ "nodeAddr", "structzcl_o_t_a___query_specific_file_req_params__t.html#ad492a9e9eaae85d95defc11116cac77c", null ],
      [ "stackVersion", "structzcl_o_t_a___query_specific_file_req_params__t.html#abe49ae1a7605a673f819a6750eb3edc7", null ]
    ] ],
    [ "zclOTA_CallbackMsg_t", "structzcl_o_t_a___callback_msg__t.html", [
      [ "hdr", "structzcl_o_t_a___callback_msg__t.html#a3d1cb0251ff957226de1ef3cb6d3b2b0", null ],
      [ "ota_event", "structzcl_o_t_a___callback_msg__t.html#a928ff0cbe6d7b2c04fe7aeb27e107e22", null ]
    ] ]
];