import Vue from 'vue'
import DashBoard from '@/views/dashboard/dashboard'

describe('DashBoard.vue', () => {
  it('dashboard内容正确', () => {
    const Constructor = Vue.extend(DashBoard)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#dash-board h1').textContent).to.equal('欢迎来到狱务公开管理平台')
  })
})
