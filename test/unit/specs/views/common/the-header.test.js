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
          logout: spyLogout
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

  it('method-handleLogout', done => {
    wrapper = shallowMount(component, {
      store,
      localVue,
      router
    })

    wrapper.vm.handleLogout()

    wrapper.vm.$nextTick(() => {
      // expect(wrapper.find('["aria-label"="提示"]').exists()).toBe(true)
      done()
    })
  })
})