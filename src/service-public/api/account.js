import { get, postForm } from '../request'

export function login({ username, password }) {
  return postForm('/oauth/token', {
    username,
    password,
    grant_type: 'password',
    mode: 'account_password'
  })
}

export function getUserInfo() {
  return get('/users/me')
}

export function getMenus() {
  return get('/menus/my')
}

