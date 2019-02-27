import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/components/modules/form'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(ElementUI)

describe('components-form', () => {
  let wrapper

  beforeEach(() => {
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounted-render', () => {
    let spyRender = jest.fn()
    wrapper = shallowMount(component, {
      localVue,
      methods: {
        render: spyRender
      }
    })
    
    expect(spyRender).toHaveBeenCalled()
  })

  it('beforeDestroy', () => {
    wrapper = shallowMount(component, {
      localVue
    })
    
    wrapper.destroy()
    expect(wrapper.vm.destroyed).toBeTruthy()
  })

  it('methods-onPrevClick', () => {
    wrapper = shallowMount(component, {
      localVue,
      router
    })
    
    wrapper.vm.$router.push('/dashboard')
  })
})