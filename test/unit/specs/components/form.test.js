import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/components/modules/form'
import formItem from '@/components/modules/form-item'

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

  it('methods-onPrevClick', (done) => {
    localVue.use(VueRouter)
    wrapper = shallowMount(component, {
      localVue,
      router
    })
    
    wrapper.vm.$router.push('/aaa')
    wrapper.vm.$router.push('/bbb')
    wrapper.vm.onPrevClick()
    setTimeout(() => {
      expect(wrapper.vm.$route.path).toBe('/aaa')
      done()
    }, 10)
  })

  it('methods-onSubmit', (done) => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        items: {
          buttons: ['add'],
          age: { type: 'input', label: '年龄', value: 9, rule: ['isNumber'] },
          name: { type: 'input', label: '姓名', value: 'aaa', rule: ['required'] }
        }
      }
    })

    setTimeout(() => {
      // if (wrapper.vm.flag === true) {
      //   console.log(wrapper.vm.$refs)
      // }
      done()
    }, 300)
    console.log(wrapper.text())
    // setTimeout(() => {
    //   let button = wrapper.find('button')
    //   button.trigger('click')
    //   console.log(wrapper.html())
    //   done()
    // }, 2000)
    // setTimeout(() => {
    //   wrapper.vm.$refs.form.validate(valid => {
    //     expect(valid).toBeFalsy()
    //     console.log(8989)
    //     done()
    //   })
    // }, 100)
    
  })
})