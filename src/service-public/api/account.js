import { get, postForm, put, post } from '../request'

export function login({ username, password }) {
  return postForm('/oauth/token', {
    username,
    password,
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
  return get('/menus/my')
}

export function modifyMyPassword({ oldPassword, newPassword }) {
  return put('/users/me/password/by-old-password', { oldPassword, newPassword })
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
