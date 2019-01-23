import Vue from 'vue'
import ElementUI from 'element-ui'
import vueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-breadcrumb'
import routes from '@/router/modules/superAdmin'

const localVue = createLocalVue()
localVue.use(ElementUI)

describe('views-面包屑', () => {
  let wrapper

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounted正确', () => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $route: {
          matched: [{
            parent: {
              name: '监狱管理',
              path: '/prison'
            },
            path: '/prison/add',
            name: '新增监狱'
          }],
          path: '/prison/add',
          name: '新增监狱'
        }
      }
    })

    expect(wrapper.vm.breadcrumb).toMatchObject([{ name: '监狱管理', path: '/prison' }, { name: '新增监狱', path: '/prison/add' }])
  })

  it('methods-render', () => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $route: {
          matched: [{
            parent: {
              name: '监狱管理',
              path: '/prison'
            },
            path: '/prison/add',
            name: '新增监狱'
          }],
          path: '/prison/add',
          name: '新增监狱'
        }
      }
    })
    let router = new vueRouter({ routes, mode: 'history' })
    console.log(router.options.routes)
    // wrapper.vm.render('')
  })
})