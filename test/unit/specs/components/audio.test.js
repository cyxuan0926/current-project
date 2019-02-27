// import ElementUI from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import component from '@/components/modules/audio'
const localVue = createLocalVue()
// localVue.use(ElementUI)
jest.useFakeTimers()
describe.skip('components-audio', () => {
  let wrapper

  beforeEach(() => {
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it.skip('mounted正确', () => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        value: 'http://120.78.190.101:1339/audio-server/audios/Lovestoned - Bye Bye Bye-1542884826919.mp3?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
      }
    })
    expect(wrapper.vm.show).toBe(false)
    expect(wrapper.vm.leastTime).toBeNull()
    expect(wrapper.vm.progressBarVal).toBe(0)
    expect(wrapper.vm.audioImg).toBe(3)
    expect(wrapper.vm.interval).toBeNull()
  })

  it.skip('method-handlePlay', done => {
    wrapper = shallowMount(component, {
      localVue,
      propsData: {
        value: 'http://120.78.190.101:1339/audio-server/audios/Lovestoned - Bye Bye Bye-1542884826919.mp3?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
      }
    })

    let audio = wrapper.find({ ref: 'audio' })
    audio.trigger('pause')
    console.log(audio.element.paused)
    wrapper.vm.handlePlay()
    wrapper.vm.$nextTick(() => {
      console.log(audio.duration)
      expect(setInterval).toHaveBeenCalledTimes(1)
      done()
    })
  })
})