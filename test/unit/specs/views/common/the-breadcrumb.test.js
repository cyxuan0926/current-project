import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/views/common/the-breadcrumb'


const localVue = createLocalVue()
localVue.use(ElementUI)

const router = new VueRouter()

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

  it('watch-$route', done => {
    localVue.use(VueRouter)
    wrapper = shallowMount(component, {
      localVue,
      router
    })
    let spyRoute = jest.fn()
    wrapper.setMethods({ render: spyRoute })
    // wrapper.vm._watchers[0].cb.apply(wrapper.vm, [{ path: '/prison/add' }])
    wrapper.vm.$router.push('/hahaha')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.render).toHaveBeenCalled()
      done()
    })
  })
})
