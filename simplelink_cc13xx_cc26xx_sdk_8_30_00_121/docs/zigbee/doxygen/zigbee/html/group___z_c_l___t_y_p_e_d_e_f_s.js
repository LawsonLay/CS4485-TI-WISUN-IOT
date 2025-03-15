var group___z_c_l___t_y_p_e_d_e_f_s =
[
    [ "zclFrameControl_t", "structzcl_frame_control__t.html", [
      [ "direction", "structzcl_frame_control__t.html#ac7e977c3f00d50b1cd332813fa428b4d", null ],
      [ "disableDefaultRsp", "structzcl_frame_control__t.html#a5fb6bbcda8ae1e894c29c181e3972fe0", null ],
      [ "manuSpecific", "structzcl_frame_control__t.html#af9375e7e3f14c231ceb0f10acd1b0d84", null ],
      [ "reserved", "structzcl_frame_control__t.html#a05d5cbcb44f437341bd9fa37d589aced", null ],
      [ "type", "structzcl_frame_control__t.html#a4bfea42429249a1f65204f0c0f34704a", null ]
    ] ],
    [ "zclFrameHdr_t", "structzcl_frame_hdr__t.html", [
      [ "commandID", "structzcl_frame_hdr__t.html#ac0f6723a1fb1d7f47c5a11566b20dc67", null ],
      [ "fc", "structzcl_frame_hdr__t.html#a3ebe37a65a3d39ce33ca5b7bc188d07c", null ],
      [ "manuCode", "structzcl_frame_hdr__t.html#acecd7c519d853aeae5fba2e4b945a07f", null ],
      [ "transSeqNum", "structzcl_frame_hdr__t.html#ac4740189ed1734610530700dd864e47f", null ]
    ] ],
    [ "zclIncoming_t", "structzcl_incoming__t.html", [
      [ "attrCmd", "structzcl_incoming__t.html#ad1d160b366c5b77df63f3128bd1b6a42", null ],
      [ "hdr", "structzcl_incoming__t.html#abbb6f8190d7cd31035ff071034a9dd49", null ],
      [ "msg", "structzcl_incoming__t.html#abf20a0503d60b719007515023ad678db", null ],
      [ "pData", "structzcl_incoming__t.html#a77f0d5374ee675db57c0b29946ca7744", null ],
      [ "pDataLen", "structzcl_incoming__t.html#abd63c54ffcb32c3a9ab6975d0f903d28", null ]
    ] ],
    [ "zclIncomingMsg_t", "structzcl_incoming_msg__t.html", [
      [ "attrCmd", "structzcl_incoming_msg__t.html#ad1d160b366c5b77df63f3128bd1b6a42", null ],
      [ "clusterId", "structzcl_incoming_msg__t.html#acd6f0c9575ca30de73d1924e39c71125", null ],
      [ "endPoint", "structzcl_incoming_msg__t.html#a2e332a04e01a8f27fbdb3d5e8891d011", null ],
      [ "hdr", "structzcl_incoming_msg__t.html#a3d1cb0251ff957226de1ef3cb6d3b2b0", null ],
      [ "srcAddr", "structzcl_incoming_msg__t.html#a3c0adecbd33ed51c977cb32067fe523e", null ],
      [ "zclHdr", "structzcl_incoming_msg__t.html#a00f889a691f6e121423cf9f0f5e4d53f", null ]
    ] ],
    [ "zclCommandRec_t", "structzcl_command_rec__t.html", [
      [ "clusterID", "structzcl_command_rec__t.html#a7b9434e3ec3c9da5b4af8bedd222a033", null ],
      [ "cmdID", "structzcl_command_rec__t.html#afbced1dc73a6865520b32fc56b765988", null ],
      [ "flag", "structzcl_command_rec__t.html#aff31312fb16705aa73c53b945a1a6b30", null ]
    ] ],
    [ "zclAttribute_t", "structzcl_attribute__t.html", [
      [ "accessControl", "structzcl_attribute__t.html#ac7671ea77fb73816248a05a4862e6583", null ],
      [ "attrId", "structzcl_attribute__t.html#aa5c6e42d0526688f2ce8fbded59a393c", null ],
      [ "dataPtr", "structzcl_attribute__t.html#ac78c5fa7d874fb10caaec568b612a4d3", null ],
      [ "dataType", "structzcl_attribute__t.html#a6b7b7ceb405c88144ed466f8d84006b8", null ]
    ] ],
    [ "zclAttrRec_t", "structzcl_attr_rec__t.html", [
      [ "attr", "structzcl_attr_rec__t.html#a54d8361703d62c362241eacf40dba68e", null ],
      [ "clusterID", "structzcl_attr_rec__t.html#a7b9434e3ec3c9da5b4af8bedd222a033", null ]
    ] ],
    [ "zclOptionRec_t", "structzcl_option_rec__t.html", [
      [ "clusterID", "structzcl_option_rec__t.html#a7b9434e3ec3c9da5b4af8bedd222a033", null ],
      [ "option", "structzcl_option_rec__t.html#a1df02ff5cc3412fa44ecb6aaaa31d29e", null ]
    ] ],
    [ "zclParseCmd_t", "structzcl_parse_cmd__t.html", [
      [ "dataLen", "structzcl_parse_cmd__t.html#ae058dd8f2f1a0c16b3947d6bfdbd51c2", null ],
      [ "endpoint", "structzcl_parse_cmd__t.html#a7d397493728da2bca8d55b2d61c4ec5d", null ],
      [ "pData", "structzcl_parse_cmd__t.html#a77f0d5374ee675db57c0b29946ca7744", null ]
    ] ],
    [ "zclAttrRecsList", "structzcl_attr_recs_list.html", [
      [ "attrs", "structzcl_attr_recs_list.html#a644e5dea9d4fb03f734df0b14e665b16", null ],
      [ "endpoint", "structzcl_attr_recs_list.html#a7d397493728da2bca8d55b2d61c4ec5d", null ],
      [ "next", "structzcl_attr_recs_list.html#aeb40ab2b27e462e26e8dd16da142a4c2", null ],
      [ "numAttributes", "structzcl_attr_recs_list.html#abd1a6e3a14ecf4a6eb8c97d9b3ebb762", null ],
      [ "pfnAuthorizeCB", "structzcl_attr_recs_list.html#a83b94089e94631406c1fa22c4e032269", null ],
      [ "pfnReadWriteCB", "structzcl_attr_recs_list.html#a0bb84af474e20a01de034eb356e241a4", null ]
    ] ],
    [ "zclAttrRecsList", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga1beead1c98dbcfb3e4d5ab6c1ce8af4d", null ],
    [ "zclAuthorizeCB_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga69c8bee5f3a63b66626055f22018cb53", null ],
    [ "zclInHdlr_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga3f0031cbf23e55c5099b7e367200a8f0", null ],
    [ "zclInWrtHdlr_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#gae64af0463948ff0990be814e750ea7ec", null ],
    [ "zclReadWriteCB_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#gaf430badb38da158b599753aa56145284", null ],
    [ "zclValidateAttrData_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#gaf89a353dc4134ac5db819d326d306295", null ],
    [ "zclProcMsgStatus_t", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga64d6b6104c9fd3931297d532282d5bfd", [
      [ "ZCL_PROC_SUCCESS", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfdacc9b08e9765b07530c07c42fbcb591fb", null ],
      [ "ZCL_PROC_INVALID", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda0e625bd9d36aca2ff79c55918d4ec97c", null ],
      [ "ZCL_PROC_EP_NOT_FOUND", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda30adc31cc5e3e822a633b57884831dea", null ],
      [ "ZCL_PROC_NOT_OPERATIONAL", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda51fc0e60011f2b3f6e8cca16f88fda23", null ],
      [ "ZCL_PROC_INTERPAN_FOUNDATION_CMD", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfdad833f1b4225c487e264597bfbfcd6138", null ],
      [ "ZCL_PROC_NOT_SECURE", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfdad4d37487bc99d5169a0964dcb44186aa", null ],
      [ "ZCL_PROC_MANUFACTURER_SPECIFIC", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda66dc95f252c50f96a6606fc00610ae44", null ],
      [ "ZCL_PROC_MANUFACTURER_SPECIFIC_DR", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda04e5246daf26a2d8d843dbf31cf44c1a", null ],
      [ "ZCL_PROC_NOT_HANDLED", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda25c069a9789eb68e20d2f8093bb05e1b", null ],
      [ "ZCL_PROC_NOT_HANDLED_DR", "group___z_c_l___t_y_p_e_d_e_f_s.html#gga64d6b6104c9fd3931297d532282d5bfda0ff6ca011587bfdd87fe54e0f7e61ff0", null ]
    ] ],
    [ "aExtAttrInfo", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga13fbea8e491496750f6398b29b1d8e88", null ],
    [ "attrAccessControl", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga2ec58bf05feac1a9e70950f63f6f8d36", null ],
    [ "attrData", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga84fea1e23ab88e04de64cce8b14d523e", null ],
    [ "attrDataType", "group___z_c_l___t_y_p_e_d_e_f_s.html#gae540e6d6a29998a6ca61a1b5001289e2", null ],
    [ "attrID", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga58943ad4183bbab15a928fc65ea0d761", null ],
    [ "attrList", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga5a95c10ae062bb87c73621a4a4f3b406", null ],
    [ "cmdType", "group___z_c_l___t_y_p_e_d_e_f_s.html#gad4c5a4ffa1765cf164f4fe3e55262e42", null ],
    [ "data", "group___z_c_l___t_y_p_e_d_e_f_s.html#gabe222f6d3581e7920dcad5306cc906a8", null ],
    [ "dataType", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga6b7b7ceb405c88144ed466f8d84006b8", null ],
    [ "direction", "group___z_c_l___t_y_p_e_d_e_f_s.html#gac6116d5235e13e059e591879c46d7174", null ],
    [ "maxAttrIDs", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga4abe2c9b08eede35de820bcaa8ffd258", null ],
    [ "maxCmdID", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga017d7848df7939a9c37f82c407c601ee", null ],
    [ "maxReportInt", "group___z_c_l___t_y_p_e_d_e_f_s.html#gaf6a00feec72caf5a5025e7139896bc72", null ],
    [ "minReportInt", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga5489f8f2a26b06cfd2bf4ef11b7c5283", null ],
    [ "numAttr", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga572d39c883c272efaa66f4806db1f177", null ],
    [ "numCmd", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga51185d7de25ce4ef834b80b02738f043", null ],
    [ "PACKED_TYPEDEF_STRUCT", "group___z_c_l___t_y_p_e_d_e_f_s.html#gab205ffa1cf182ebf23d84b945300c631", null ],
    [ "pCmdID", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga03e96e59eee2264f4e47b7bd9a30ba82", null ],
    [ "pStr", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga5c90cb54bda68551e89e6791e88ba238", null ],
    [ "reportableChange", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga88ae4e029d3c61f76b5df8c0ee6a126d", null ],
    [ "status", "group___z_c_l___t_y_p_e_d_e_f_s.html#gade818037fd6c985038ff29656089758d", null ],
    [ "timeoutPeriod", "group___z_c_l___t_y_p_e_d_e_f_s.html#ga1b366db92c116a247c2568777a24e53d", null ]
];