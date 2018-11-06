import { destroyVM, createTest } from './util'
import Login from '@/views/login/new-login'

describe('Login.vue', function() {
  this.timeout(5000)
  const vm = createTest(Login, {}, true)

  afterEach(() => {
    destroyVM(vm)
  })

  it('验证通过', () => {
    vm.loginForm.password = '123456'
    vm.loginForm.username = '4501_sh'
    vm.loginForm.prison = '4501'
    vm.$refs.loginForm.$el.querySelectorAll('input').forEach(item => {
      item.focus()
      item.blur()
    })

    vm.$refs.loginForm.validate(valid => {
      expect(valid).to.true
    })
  })

  it('登陆成功', (done) => {
    vm.loginForm.password = '123456'
    vm.loginForm.username = '4501_sh'
    vm.loginForm.prison = '4501'

    vm.login(vm.loginForm)
    setTimeout(function() {
      expect(vm.$store.state.users).to.have.property('id')
      done()
    }, 300)
  })
})
