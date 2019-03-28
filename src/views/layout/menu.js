let superAdminMenu = [{
  //   path: '/test/test',
  //   title: '测试表单',
  //   icon: 'iconfont icon-jianyuguanli'
  // }, {
    path: '/prison/list',
    title: '监狱管理',
    icon: 'iconfont icon-jianyuguanli'
  }, {
    path: '/prison-area/list',
    title: '监区管理',
    icon: 'iconfont icon-jianquxinxi'
  }, {
    path: '/prison-user/list',
    title: '监狱用户管理',
    icon: 'iconfont icon-jianyuyonghu'
  }, {
    path: '/family-remittance/list',
    title: '家属汇款记录',
    icon: 'iconfont icon-jiashuhuikuanjilu'
  }, {
    path: '/trade/account',
    title: '交易流水记录',
    icon: 'iconfont icon-jiaoyiliushuijilu'
  },
  {
    path: '/feedback/list',
    title: '意见反馈',
    icon: 'iconfont icon-yijian'
  }, {
    path: '/advertisement/list',
    title: '广告管理',
    icon: 'iconfont icon-guanggaoguanli'
  }, {
    path: '/whitemember/list',
    title: '白名单管理',
    icon: 'iconfont icon-baimingdan'
  }, {
    path: '/terminal/list',
    title: '终端管理',
    icon: 'iconfont icon-zhongduanguanli'
  }, {
    path: '/version/list',
    title: '版本管理',
    icon: 'iconfont icon-banbengengxin'
  }, {
    path: '/log/app-error',
    title: 'APP崩溃日志',
    icon: 'iconfont icon-bengkuirizhi'
  }],
  checkMenu = [{
    path: '/registration/list',
    title: '家属注册管理',
    icon: 'iconfont icon-jiashuzhuce'
  }, {
    path: '/meeting',
    title: '会见申请管理',
    icon: 'iconfont icon-huijianshenqing',
    active: false,
    children: [
      {
        path: '/meeting/list',
        title: '会见申请列表',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/meeting/adjust',
        title: '会见申请调整',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/meeting/records',
        title: '免费会见记录',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }, {
    path: '/meeting-report',
    title: '会见统计',
    icon: 'iconfont icon-huijiantongji',
    active: false,
    children: [
      {
        path: '/meeting-report/prison',
        title: '监狱统计',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/meeting-report/prison-area',
        title: '监区统计',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }, {
    path: '/visit/list',
    title: '实地探监管理',
    icon: 'iconfont icon-shidihuijian'
  }, {
    path: '/mailbox/list',
    title: '监狱长信箱',
    icon: 'iconfont icon-jianyuchangxinxiang'
  }, {
    path: '/prisoner/list',
    title: '服刑人员信息管理',
    icon: 'iconfont icon-fuxingrenyuan'
  }, {
    path: '/prisoner-pocket-money/list',
    title: '服刑人员零花钱管理',
    icon: 'iconfont icon-linghuaqianguanli'
  }, {
    path: '/prisoner-inside-jails-costs/list',
    title: '服刑人员狱内消费情况',
    icon: 'iconfont icon-yuneixiaofeiqingkuang'
  }, {
    path: '/family/list',
    title: '家属信息管理',
    icon: 'iconfont icon-jiashu'
  // }, {
  //   path: '/prison-accounts/list',
  //   title: '囚犯账户管理',
  //   icon: 'iconfont icon-folder'
  }, {
    path: '/prisoner-data',
    title: '数据管理',
    icon: 'iconfont icon-shujuguanli',
    active: false,
    children: [
      {
        path: '/prisoner-data/data-import',
        title: '罪犯数据导入',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/prisoner-data/term-change',
        title: '刑期变动数据导入',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/prisoner-data/reward-punishment',
        title: '罪犯奖惩数据导入',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/prisoner-data/pocket-money',
        title: '零花钱数据导入',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/prisoner-data/inside-jails-costs',
        title: '狱内消费情况数据导入',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }],
  shopMenu = [{
    path: '/goods_management',
    title: '商品管理',
    icon: 'iconfont icon-folder'
  }, {
    path: '/orders',
    title: '家属订单',
    icon: 'iconfont icon-folder'
  }, {
    path: '/prisoner_orders',
    title: '订单管理',
    icon: 'iconfont icon-folder',
    active: false,
    children: [
      {
        path: '/prisoner_orders/import_index',
        title: '罪犯数据导入',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }],
  infoMenu = [{
    path: '/jails/detail',
    title: '监狱基本信息管理',
    icon: 'iconfont icon-jianyujibenxinxi'
  }, {
    path: '/prison-affairs-public',
    title: '狱务公开信息管理',
    icon: 'iconfont icon-yuwugongkaixinxi',
    active: false,
    children: [
      {
        path: '/prison-affairs-public/prison-affairs-public',
        title: '狱务公开',
        icon: 'iconfont icon-circle-o',
        children: [
          {
            path: '/prison-affairs-public/prison-affairs-public/4',
            title: '减刑假释',
            icon: 'iconfont icon-circle-o'
          },
          {
            path: '/prison-affairs-public/prison-affairs-public/5',
            title: '暂予监外执行',
            icon: 'iconfont icon-circle-o'
          },
          {
            path: '/prison-affairs-public/prison-affairs-public/6',
            title: '社会帮教',
            icon: 'iconfont icon-circle-o'
          }
        ]
      }, {
        path: '/prison-affairs-public/working-dynamics',
        title: '工作动态',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/prison-affairs-public/complaints-suggestions',
        title: '投诉建议公示',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }, {
    path: '/remote/edit',
    title: '远程会见配置',
    icon: 'iconfont icon-yuanchenghuijian'
  }, {
    path: '/visit/config',
    title: '实地探监配置',
    icon: 'iconfont icon-shidihuijian'
  }],
  adminMenu = [{
    path: '/account/list',
    title: '账户管理',
    icon: 'iconfont icon-zhanghuguanli'
  }, {
    path: '/adminPrison-area/list',
    title: '监区管理',
    icon: 'iconfont icon-jianquxinxi'
  }, {
    path: '/meeting-report',
    title: '会见统计',
    icon: 'iconfont icon-huijiantongji',
    active: false,
    children: [
      {
        path: '/meeting-report/prison',
        title: '监狱统计',
        icon: 'iconfont icon-circle-o'
      }, {
        path: '/meeting-report/prison-area',
        title: '监区统计',
        icon: 'iconfont icon-circle-o'
      }
    ]
  }]

export default [superAdminMenu, checkMenu, shopMenu, infoMenu, adminMenu]
