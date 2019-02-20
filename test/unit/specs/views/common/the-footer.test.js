import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-footer'

const localVue = createLocalVue()

describe('views-尾部', () => {
  let wrapper

  afterEach(() => {
    wrapper.destroy()
  })

  it('data初始化正确', () => {
    wrapper = shallowMount(component, {
      localVue
    })

    let year = new Date().getFullYear()
    expect(wrapper.vm.year).toEqual(year)
  })
})
