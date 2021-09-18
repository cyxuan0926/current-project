import { get, postForm, put, post } from '../request'

import { JSEncryptEncrypt } from '@/common/constants/rsa'

export function login({
  username,
  password,
  code,
  codeKey
}) {
  return postForm('/oauth/token', {
    codeKey,
    code,
    username,
    password: JSEncryptEncrypt(password),
    grant_type: 'password',
    mode: 'account_password'
  }, {
    auth: {
      username: 'visit.admin',
      password: '3cceca7160774a40b01c7fdadfb37da0'
    }
  })
}

export function getPublicUserInfo() {
  return get('/users/me')
}

export function getMenus() {
  return get('/menus/my?clientId=visit.admin')
}

export function modifyMyPassword({ oldPassword, newPassword }) {
  return put('/users/me/password/by-old-password', { oldPassword: JSEncryptEncrypt(oldPassword), newPassword: JSEncryptEncrypt(newPassword) })
}

export function getRoles() {
  return get('/roles')
}

export function estimateUsername({ username }) {
  return get('/users/usernames', { username })
}

export function getAllTenants() {
  return get('/tenants')
}

export function getSecurityQuestions() {
  return get('/security-questions')
}

export function getUserSecurityQuestions({ username }) {
  return get('/users/security-question-answers/by-username', { username })
}

export function getUserSecurityQuestionAnswers() {
  return get('/users/security-question-answers/my')
}

export function setUserSecurityQuestionAnswers(questionAnswers) {
  return put('/users/security-question-answers/my', questionAnswers)
}

export function verificateSecurityQuestionAnswers({ username, questionAnswers }) {
  return post('/users/security-question-answers/verification', { username, questionAnswers })
}

export function modifyMyPasswordByToken({ token, newPassword }) {
  return put('/users/password/by-token', { token, newPassword })
}

// 获取用户信息
export function getPublicUsers(params) {
  return get('/users', params)
}

// 获取流程角色
export function getProcessRoles(id) {
  return get(`/roles/tenant/${ id }`)
}

// 获取验证码
export const getCaptcha = () => {
  return get('/captcha')
}

// 通过账号 发送短信验证码
export const sendSmsByAccount = username => post('/sms/verification-codes/username', { username })

// 通过手机号 发送短信验证码
export const sendSmsByPhone = phoneNumber => post('/sms/verification-codes', { phoneNumber })

// 账户绑定手机号
export const userBindByPhone = data => post('/users/updatephone', data)

// 根据短信验证码重置我的密码
export const modifyMyPasswordByCode = params => {
  const { newPassword } = params

  return post('/users/password/username/by-code', Object.assign({}, params, { newPassword: JSEncryptEncrypt(newPassword) }))
}
