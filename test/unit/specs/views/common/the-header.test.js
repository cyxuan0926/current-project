import Vuex from 'vuex'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-header'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)

const router = new VueRouter()

describe.skip('views-侧边栏', () => {
  let wrapper,
      store,
      spyHandleCollapse = jest.fn(),
      spyLogout = jest.fn(),
      global = {
        state: {
          user: {
            username: 'username'
          }
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
      localVue,
      mocks: {
        $route: { path: '/prison/list', meta: {} }
      }
    })
    expect(wrapper.vm.menu instanceof Array).toBe(true)
    expect(wrapper.vm.menu.length).toBeGreaterThan(1)
    expect(wrapper.vm.prisonerAreas instanceof Array).toBe(true)
    expect(wrapper.vm.prisonerAreas).toEqual(['一监区', '二监区'])
    expect(wrapper.vm.user).toMatchObject(global.state.user)
    expect(wrapper.vm.isCollapsed).toBe(false)
  })

  it('method-getActiveMenu', () => {
    wrapper = shallowMount(component, {
      store,
      localVue,
      mocks: {
        $route: { path: '/prison/add', meta: { deep: true } }
      }
    })

    expect(wrapper.vm.getActiveMenu()).toBe('/prison/list')

    wrapper.vm.$route.path = '/prison-user/edit/55'
    expect(wrapper.vm.getActiveMenu()).toBe('/prison-user/list')
  })

  it('method-handleSelect', (done) => {
    localVue.use(VueRouter)
    wrapper = shallowMount(component, {
      store,
      localVue,
      router
    })

    wrapper.vm.handleSelect('/prison/list')

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.path).toEqual('/prison/list')
      done()
    })
  })
})