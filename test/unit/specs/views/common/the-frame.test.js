import Vuex from 'vuex'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-frame'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)
localVue.use(VueRouter)

const router = new VueRouter()

describe('views-页面布局', () => {
  let wrapper,
      spyHandleCollapse = jest.fn(),
      store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        layout: {
          state: { isCollapsed: false }
        },
        global: {
          actions: {
            handleCollapse: spyHandleCollapse
          }
        }
      }
    })
  })                                   
  afterEach(() => {
    wrapper.destroy()
  })

  it('mounted正确', () => {
    let spyHandleResize = jest.fn()
    wrapper = shallowMount(component, {
      store,
      localVue,
      router,
      methods: {
        handleResize: spyHandleResize
      }
    })

    expect(spyHandleResize).toHaveBeenCalled()
  })

  it('methods-handleResize', () => {
    wrapper = shallowMount(component, {
      store,
      localVue,
      router
    })

    window.innerWidth = 700
    wrapper.setData({ hidden: false })
    wrapper.vm.handleResize()
    expect(spyHandleCollapse).toHaveBeenCalled()
    expect(wrapper.vm.hidden).toBe(true)

    spyHandleCollapse.mockClear()
    wrapper.setData({ hidden: true })
    wrapper.vm.handleResize()
    expect(spyHandleCollapse).not.toHaveBeenCalled()

    window.innerWidth = 800
    wrapper.vm.handleResize()
    expect(wrapper.vm.hidden).toBe(false)
  })

})