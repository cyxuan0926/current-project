import http from '@/service'

export default {
  // 富文本上传图片
  uploadImageFromEditor({ commit }, regs) {
    let formData = new FormData()
    formData.append('file', regs)
    http.uploadImageFromEditor(formData).then(res => commit('uploadImageFromEditor', res)).catch(err => console.log(err))
  },
  handleDeleteImage: ({ commit }, params) => {
    let images = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [],
      oldImages = localStorage.getItem('oldImages') ? JSON.parse(localStorage.getItem('oldImages')) : [],
      excpt = params[0] ? [params[0]] : [],
      allImages = Array.from(new Set(images.concat(oldImages)))
    if (allImages.length === 0) return
    if (params[1].match(/<img.*? \/>/g)) {
      params[1].match(/<img.*? \/>/g).forEach(ele => {
        let a = document.createElement('div')
        a.innerHTML = ele
        excpt.push(a.lastElementChild.src.split('?token=')[0])
      })
    }
    http.deleteImage(allImages.filter(url => excpt.indexOf(url) < 0)).then(res => {
      if (res) {
        localStorage.removeItem('images')
        localStorage.removeItem('newImages')
        localStorage.setItem('oldImages', JSON.stringify(excpt))
      }
    })
  },
  deleteUnusedImage: ({ commit }) => {
    localStorage.removeItem('images')
    localStorage.removeItem('oldImages')
    let newImages = localStorage.getItem('newImages') ? JSON.parse(localStorage.getItem('newImages')) : []
    if (!newImages.length) return
    http.deleteImage(newImages).then(res => {
      if (res) {
        localStorage.removeItem('newImages')
      }
    })
  }
}
