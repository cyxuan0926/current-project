import http from '@/service'
var deleting = false

export default {
  // 富文本上传图片
  uploadImageFromEditor({ commit }, regs) {
    let formData = new FormData()
    formData.append('file', regs)
    http.uploadImageFromEditor(formData).then(res => commit('uploadImageFromEditor', res)).catch(err => console.log(err))
  },
  handleDeleteImage: ({ commit }, params) => {
    // debugger
    let images = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [],
      oldImages = localStorage.getItem('oldImages') ? JSON.parse(localStorage.getItem('oldImages')) : [],
      excpt = params[0] ? (typeof params[0] === 'string' ? [params[0]] : params[0]) : [],
      allImages = Array.from(new Set(images.concat(oldImages)))
    if (allImages.length === 0) return
    if (params[1] && params[1].match(/<img.*? \/>|<source.*? \/>/g)) {
      params[1].match(/<img.*? \/>|<source.*? \/>/g).forEach(ele => {
        let a = document.createElement('div')
        a.innerHTML = ele
        if (excpt.indexOf(decodeURI(decodeURI(a.lastElementChild.src.split('?token=')[0]))) < 0) excpt.push(decodeURI(a.lastElementChild.src.split('?token=')[0]))
      })
    }
    deleting = true
    http.deleteImage(allImages.filter(url => excpt.indexOf(url) < 0)).then(res => {
      deleting = false
      if (res) {
        localStorage.removeItem('images')
        localStorage.removeItem('newImages')
        if (!params[2]) {
          excpt.length && localStorage.setItem('oldImages', JSON.stringify(excpt))
        }
      }
    })
  },
  deleteUnusedImage: ({ commit }) => {
    localStorage.removeItem('images')
    localStorage.removeItem('oldImages')
    if (deleting === true) {
      // localStorage.removeItem('newImages')
      return
    }
    let newImages = localStorage.getItem('newImages') ? JSON.parse(localStorage.getItem('newImages')) : []
    if (!newImages.length) return
    http.deleteImage(newImages).then(res => {
      if (res) {
        localStorage.removeItem('newImages')
      }
    })
  }
}
