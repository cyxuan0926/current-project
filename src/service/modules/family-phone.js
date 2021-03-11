import * as service from '../config/service'

export default {
  getFamilyPhoneFamilies: params => {
    return service.get('', params).then(response => response.data)
  }
}
