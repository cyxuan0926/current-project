import Vuex from 'vuex'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-header'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)
localVue.use(VueRouter)

const router = new VueRouter()

describe('views-侧边栏', () => {
  let wrapper,
      store,
      spyHandleCollapse = jest.fn(),
      spyLogout = jest.fn(),
      spyResetState = jest.fn(),
      global = {
        state: {
          user: {
            username: 'username'
          }
        },
        actions: {
          resetState: spyResetState
        }
      },
      layout = {
        state: {
          isCollapsed: false
        },
        actions: {
          handleCollapse: spyHandleCollapse,
          logout: spyLogout.mockReturnValue(true).mockReturnValueOnce(false).mockReturnValueOnce(true)
        }
      }

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        global,
        layout
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounted正确', () => {
    wrapper = shallowMount(component, {
      store,
      localVue
    })
    expect(wrapper.vm.user).toMatchObject(store.state.global.user)
    expect(wrapper.vm.isCollapsed).toEqual(store.state.layout.isCollapsed)
  })

  it('method-handleNavigation', done => {
    wrapper = shallowMount(component, {
      store,
      localVue,
      router
    })

    wrapper.vm.handleNavigation('/dashboard')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.path).toBe('/dashboard')
      done()
    })
  })

  it('method-handleLogout-false', done => {
    wrapper = shallowMount(component, {
      store,
      localVue,
      router
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
      store,
      localVue,
      router
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