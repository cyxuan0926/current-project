import ElementUI from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/components/modules/form-item'
import mUploadImg from '@/components/modules/upload-img'

const localVue = createLocalVue()
localVue.use(ElementUI)
localVue.component(`mUploadImg`, mUploadImg)

describe('components-form-item', () => {
  let wrapper

  beforeEach(() => {
  })

  afterEach(() => {
    wrapper.destroy()
  })

  // it('methods-editorChange', () => {
  //   wrapper = shallowMount(component, {
  //     localVue,
  //     propsData: {
  //       prop: 'editor',
  //       fields: {
  //         editor: '<p>this is test</p>'
  //       }
  //     }
  //   })

  //   wrapper.vm.editorChange('<span>text changed</span>', 'text changed')
  //   expect(wrapper.vm.fields.editor).toBe('<span>text changed</span>')
  //   expect(wrapper.emitted().validateField).toBeTruthy()
  // })

  it('methods-tinymceChange', () => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        // item: {
        //   type: 'jaileditor',
        //   label: '内容',
        //   rules: ['required']
        // },
        prop: 'jaileditor',
        fields: {
          jaileditor: '<p>this is test</p>'
        }
      },
      mocks: {
        $urls: {
          imageUrl: 'http://120.78.190.101:1339/image-server/avatars'
        }
      }
    })
    // 测试不传content
    wrapper.vm.tinymceChange('<span>text changed</span>', 'text changed')
    expect(wrapper.vm.fields.jaileditor).toBeFalsy()
    expect(wrapper.vm.fields.summary).toBeFalsy()
    wrapper.vm.item.summary = 'summary'
    expect(wrapper.vm.fields.summary).toBeFalsy()
    expect(wrapper.emitted().validateField).toBeTruthy()
    // 测试传参数content
    wrapper.vm.tinymceChange('<span>text changed</span>', 'text changed', '<span>text changed</span>')
    expect(wrapper.vm.fields.jaileditor).toBe('<span>text changed</span>')
    expect(wrapper.vm.fields.summary).toBe('text changed')
    expect(wrapper.emitted().validateField).toBeTruthy()
  })

  it('methods-onSuccess', () => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        item: {
          type: 'uploadImg',
          label: '图片'
        },
        prop: 'uploadImg'
      }
    })
    wrapper.vm.onSuccess('http://120.78.190.101:1339/image-server/avatars/hhh-1551256763593.jpg')
    expect(wrapper.vm.fields.uploadImg).toBe('http://120.78.190.101:1339/image-server/avatars/hhh-1551256763593.jpg')
    expect(wrapper.emitted().validateField).toBeTruthy()
  })
})