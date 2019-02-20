// import ElementUI from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/components/modules/audio'

const localVue = createLocalVue()
// localVue.use(ElementUI)

describe('components-audio', () => {
  let wrapper

  beforeEach(() => {
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounted正确', () => {
    wrapper = shallowMount(component, {
      localVue
    })
    expect(wrapper.vm.show).toBe(false)
    expect(wrapper.vm.isCollapsed).toEqual(store.state.layout.isCollapsed)
  })

  it('method-handleNavigation', done => {
    wrapper = shallowMount(component, {
      localVue
    })

    wrapper.vm.handleNavigation('/dashboard')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.path).toBe('/dashboard')
      done()
    })
  })

  it('method-handleLogout-false', done => {
    wrapper = shallowMount(component, {
      localVue
    })

    // wrapper.find('.iconfont.icon-tuichu').trigger('click')
    wrapper.vm.handleLogout()

    setTimeout(() => {
      expect(getComputedStyle(document.querySelector('.el-message-box__wrapper')).getPropertyValue('display')).not.toBe('none')
      document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary').click()
      setTimeout(() => {
        expect(wrapper.vm.$route.path).not.toBe('/new-login')
        expect(spyResetState).not.toHaveBeenCalled()
        done()
      }, 10)
    }, 300)
  })
  it('method-handleLogout-true', done => {
    wrapper = shallowMount(component, {
      localVue
    })
    // wrapper.find('.iconfont.icon-tuichu').trigger('click')
    // wrapper.vm.logout().then(res => {
    wrapper.vm.handleLogout()

    setTimeout(() => {
      expect(getComputedStyle(document.querySelector('.el-message-box__wrapper')).getPropertyValue('display')).not.toBe('none')
      document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary').click()
      setTimeout(() => {
        expect(wrapper.vm.$route.path).toBe('/new-login')
        expect(spyResetState).toHaveBeenCalled()
        done()
      }, 10)
    }, 300)
  })
})