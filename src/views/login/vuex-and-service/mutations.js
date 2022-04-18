import admin from '@/router/modules/admin'
import superAdmin from '@/router/modules/superAdmin'
import check from '@/router/modules/check'
import common from '@/router/modules/common'
import information from '@/router/modules/information'

const addPath = (arr, routes = []) => {
  arr.forEach(item => {
    if (item.children) {
      addPath(item.children, routes)
    }
    else if (item.path !== '*') {
      routes.push(item.path)
    }
  })

  return routes
}

export default {
  login(_, params) {
    localStorage.setItem('user', JSON.stringify(params.users))

    switch (params.users.role) {
      case '0':
        localStorage.setItem('routes', JSON.stringify(addPath([...common, ...superAdmin])))
        break
      case '1':
        localStorage.setItem('routes', JSON.stringify(addPath([...common, ...check])))
        break
      case '3':
        localStorage.setItem('routes', JSON.stringify(addPath([...common, ...information])))
        break
      case '4':
        localStorage.setItem('routes', JSON.stringify(addPath([...common, ...admin])))
        break
      default:
        localStorage.setItem('routes', JSON.stringify(addPath(common)))
    }
  }
}
