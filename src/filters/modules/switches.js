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
    { role: '0', label: '狱务通管理员' },
    { role: '1', label: '审核人员' },
    { role: '2', label: '商品用户' },
    { role: '3', label: '信息管理人员' },
    { role: '4', label: '监狱管理员' },
    { role: '5', label: '监狱作品审核人员' },
    { role: '6', label: '家属作品审核人员' }
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
    { value: 'MEETING_ON', label: '会见中' }
  ],
  registStatus: [
    { value: 'PENDING', label: '未授权' },
    { value: 'DENIED', label: '已拒绝' },
    { value: 'PASSED', label: '已通过' }
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
      label: '已通过',
      value: 'PASSED'
    }
  ]
}

export default switches
