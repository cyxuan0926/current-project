let switches = {
  gender: [
    { value: 'm', label: '男' },
    { value: 'f', label: '女' }
  ],
  isTrue: [
    { value: 0, label: '否' },
    { value: 1, label: '是' }
  ],
  families: [
    { value: 'm', label: '男' },
    { value: 'f', label: '女' }
  ],
  role: [
    { role: '0', label: '国科服务管理员' },
    { role: '1', label: '审核人员' },
    { role: '2', label: '商品用户' },
    { role: '3', label: '信息管理人员' },
    { role: '4', label: '监狱管理员' },
    { role: '5', label: '监狱作品审核人员' },
    { role: '6', label: '家属作品审核人员' },
    { role: '7', label: '高级审核人员' }
  ],
  goodsCategory: [
    { value: 1, label: '洗化日用' },
    { value: 2, label: '食品饮料' },
    { value: 3, label: '服饰鞋帽' },
    { value: 4, label: '医药保健' },
    { value: 5, label: '电话卡' }
  ],
  applyStatus: [
    { value: 'PENDING', label: '未授权' },
    { value: 'DENIED', label: '已拒绝' },
    { value: 'PASSED', label: '已通过' },
    { value: 'FINISHED', label: '已完成' },
    // { value: 'TOBECANCELED', label: '待取消' },
    { value: 'EXPIRED', label: '已过期' },
    { value: 'CANCELED', label: '已取消' },
    { value: 'ENDED', label: '已结束' },
    { value: 'MEETING_ON', label: '通话中' }
  ],
  statusOptions: [
    { label: '上架', value: 1 },
    { label: '未上架', value: 0 }
  ],
  registStatus: [
    { value: 'PENDING', label: '未授权' },
    { value: 'DENIED', label: '已拒绝' },
    { value: 'WITHDRAW', label: '已撤回' },
    { value: 'PASSED', label: '已通过' }
  ],
  canceledStatus: [
    { value: '1', label: '家属' },
    { value: '2', label: '狱警' },
    { value: '3', label: '系统' }
  ],
  deniedStatus: [
    { value: 'CANCELED', label: '已取消' },
    { value: 'DENIED', label: '已拒绝' }
  ],
  refuseStatus: [
    { value: 'DENIED', label: '已拒绝' },
    { value: 'WITHDRAW', label: '已撤回' }
  ],
  unusualStatus: [
    { value: 'EXPIRED', label: '已过期' },
    { value: 'FINISHED', label: '已完成' },
    { value: 'ENDED', label: '已结束' },
    { value: 'MEETING_ON', label: '通话中' }
  ],
  payStatus: [
    { value: 1, label: '支付成功' },
    { value: -1, label: '支付失败' }
  ],
  payType: [
    { value: 'alipay', label: '支付宝' },
    { value: 'weixin', label: '微信' }
  ],
  status: [
    { value: 'ENABLED', label: '启用' },
    { value: 'DISABLED', label: '禁用' }
  ],
  isJailCreated: [
    { value: 1, label: '已创建' },
    { value: 0, label: '未创建' }
  ],
  isOpened: [
    {
      value: 1,
      label: '开'
    },
    {
      value: 0,
      label: '关'
    }
  ],
  coopertivePartnerTransferStatus: [
    {
      label: '转账成功',
      value: 1
    },
    {
      label: '转账失败',
      value: 0
    },
    {
      label: '未转账',
      value: 2
    }
  ],
  chargeWays: [
    {
      label: '按次收费',
      value: 1
    },
    {
      label: '按分钟收费',
      value: 2
    }
  ],
  diplomaticConsulOfficialStatus: [
    {
      label: '未授权',
      value: 'PENDING'
    },
    {
      label: '已拒绝',
      value: 'DENIED'
    },
    {
      label: '已撤回',
      value: 'WITHDRAW'
    },
    {
      label: '已通过',
      value: 'PASSED'
    }
  ],
  nationality: [
    {
      label: '大陆籍家属',
      value: 0
    },
    {
      label: '港澳台家属',
      value: 1
    },
    {
      label: '非中国籍家属',
      value: 2
    }
  ],
  terminalTypes: [
    {
      label: 'C9',
      value: 0
    },
    {
      label: '一体机',
      value: 1
    }
  ],
  orgTypes: [
    {
      label: '监狱',
      value: 0
    },
    {
      label: '司法局',
      value: 1
    },
    {
      label: '司法所',
      value: 2
    },
    {
      label: '律师事务所',
      value: 3
    },
    {
      label: '心理咨询机构',
      value: 4
    }
  ],
  areaOptions: [
    {
      label: '监舍区',
      value: '1'
    },
    {
      label: '生产区',
      value: '2'
    },
    {
      label: '会见楼',
      value: '3'
    }
  ],

  // 服刑人员转监状态枚举值
  transferOutPrisonersTypeOptions: [
    {
      label: '转入',
      value: 1
    },

    {
      label: '转出',
      value: 2
    }
  ],

  familyPhoneAuthenticationType: [
    {
      label: '未认证',
      value: 0
    },
    {
      label: '已认证',
      value: 1
    }
  ],
  type: [
    {
      label: '系统电话',
      value: 0
    },
    {
      label: '可视电话',
      value: 1
    }
  ],

  familyPhoneCheckType: [
    {
      label: '待审核',
      value: 0
    },
    {
      label: '已通过',
      value: 1
    },
    {
      label: '未通过',
      value: 2
    },
    {
      label: '已作废',
      value: 3
    }
  ],

  familyTypeOptions: [
    {
      label: '附属家属',
      value: 0
    },
    {
      label: '主家属',
      value: 1
    }
  ],

  isReleaseType: [
    {
      label: '未出狱',
      value: 0
    },
    {
      label: '已出狱',
      value: 1
    }
  ],

  isSettleAccounts: [
    {
      label: '未结算',
      value: 0
    },
    {
      label: '已结算',
      value: 1
    }
  ],

  conversationCostDetailStatus: [
    {
      label: '呼叫已接通',
      value: 'MEETING_ON'
    },
    {
      label: '呼叫已接通',
      value: 'FINISHED'
    },
    {
      label: '呼叫未接通',
      value: 'CALLFAIL'
    },
    {
      label: '呼叫未接通',
      value: 'FAULT'
    }
  ],

  familyPhoneDetailTypes: [
    {
      label: '通过',
      value: 1
    },
    {
      label: '未通过',
      value: 2
    },
    {
      label: '提交下级审核',
      value: 3
    },
    {
      label: '已作废',
      value: 4
    }
  ],

  weeksOptions: [
    { label: '星期一', value: 'Monday' },
    { label: '星期二', value: 'Tuesday' },
    { label: '星期三', value: 'Wednesday' },
    { label: '星期四', value: 'Thursday' },
    { label: '星期五', value: 'Friday' },
    { label: '星期六', value: 'Saturday' },
    { label: '星期日', value: 'Sunday' }
  ],

  isEnabledOptions: [
    {
      label: '停用',
      value: 0
    },

    {
      label: '启用',
      value: 1
    }
  ],

  terminalBusinessTypeOptions: [
    {
      label: '可视电话',
      value: 0
    },

    {
      label: '其他业务',
      value: 1
    }
  ],

  level: [
    {
      label: '宽管级',
      value: 1
    },
    {
      label: '普管级',
      value: 2
    },
    {
      label: '考察级',
      value: 3
    },
    {
      label: '严管级',
      value: 4
    }
  ],

  sendSms: [
    {
      label: '发送短信',
      value: 1
    },
    {
      label: '发送提醒短信',
      value: 2
    },
    {
      label: '发送提醒短信',
      value: 3
    },
    {
      label: '短信已达上限',
      value: 4
    },
    {
      label: '已加入黑名单',
      value: 5
    }
  ],

  familyPhoneCallRechargeTypeOptions: [
    {
      label: '充值',
      value: 0
    },
    {
      label: '退款',
      value: 1
    }
  ],

  prisonerSendMsgTypeOptions: [
    {
      label: '文字',
      value: 1,
      attrs: {
        disabled: true
      }
    },

    {
      label: '图片',
      value: 2
    }
  ]
}

// 多级审批
const multistageExamineRegistStatus = [
  ...switches['registStatus'],

  {
    label: '已提交二级审批',
    value: 'SUBMIT'
  }
]

const familySendMsgTypeOptions = [
  ...switches['prisonerSendMsgTypeOptions'],

  {
    label: "语音",
    value: 5,
  },

  {
    label: "视频",
    value: 6,
  }
]

switches = {
  ...switches,
  multistageExamineRegistStatus,
  familySendMsgTypeOptions
}

export default switches
