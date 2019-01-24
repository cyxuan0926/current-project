import Vue from 'vue'
import ElementUI from 'element-ui'
import vueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-breadcrumb'
import routes from '@/router/modules/superAdmin'
import sinon from 'sinon'

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
            path: '/prison/edit/:id',
            name: '编辑监狱'
          }],
          path: '/prison/edit/77',
          name: '编辑监狱'
        }
      }
    })
    expect(wrapper.vm.breadcrumb).toMatchObject([{ name: '监狱管理', path: '/prison' }, { name: '编辑监狱', path: '/prison/edit/:id' }])
  })

  it('watch-$route', () => {
    wrapper = shallowMount(component, {
      localVue,
      mocks: {
        $route: {
          matched: [{
            parent: {
              name: '监狱管理',
              path: '/prison'
            },
            path: '/prison/edit/:id',
            name: '编辑监狱'
          }],
          path: '/prison/edit/77',
          name: '编辑监狱'
        }
      }
    })
    
    let spyRoute = sinon.spy()
    wrapper.vm.$route.$on('change', spyRoute)
    wrapper.vm.$route = { path: '/dashboard', name: 'gongzuotai' }
    console.log(wrapper.vm.$route.path)
    expect(spyRoute).toHaveBeenCalled()
  })
})