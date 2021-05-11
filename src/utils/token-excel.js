import { helper } from '@/utils'

import _Store from '@/store'

export const tokenExcel = async({
    params = {},
    actionName = '',
    menuName = '',
    type = 'xls',
    formater = function(input = menuName) { return input }
  }) => {
  try {
    let link = document.createElement('a')

    const res = await _Store.dispatch(actionName, params)

    if (!res) return

    const url = helper.createObjectURL(res)

    const fileName = formater(menuName)

    link.href = url

    link.id = 'linkId'

    link.setAttribute('download', `${ fileName }.${ type }`)

    document.body.appendChild(link)

    document.getElementById('linkId').click()

    document.body.removeChild(document.getElementById('linkId'))

    return true
  }
  catch (err) {
    Promise.reject(err)
  }
}
