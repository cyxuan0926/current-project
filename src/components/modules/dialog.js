export default function(Vue) {
    Vue.component('ElDialog', {
        components: {
            MyElDialog: Vue.component('ElDialog')
        },
        data() {
            const dragData = {
                x: 0,
                y: 0,
                clientX: 0,
                clientY: 0
            }
            return {
                dragOptions: {
                    group: 'dialog',
                    // 拖拽开始
                    onStart({ item, originalEvent }) {
                        let dialog = item.querySelector('.el-dialog')
                        dragData.x = dialog.offsetLeft
                        dragData.y = dialog.offsetTop
                        dragData.clientX = originalEvent.clientX
                        dragData.clientY = originalEvent.clientY
                    },
                    // 拖拽结束
                    onEnd({ item, originalEvent }) {
                        let dialog = item.querySelector('.el-dialog'),
                            detX = originalEvent.clientX - dragData.clientX,
                            detY = originalEvent.clientY - dragData.clientY,
                            x = dragData.x + detX,
                            y = dragData.y + detY,
                            maxW = window.innerWidth - dialog.offsetWidth,
                            maxH = window.innerHeight - dialog.offsetHeight
                        if (x >= maxW) {
                            x = maxW
                        }
                        else if (x <= 0) {
                            x = 0
                        }
                        if (y >= maxH) {
                            y = maxH
                        }
                        else if (y <= 0) {
                            y = 0
                        }
                        dialog.style.margin = '0'
                        dialog.style.left = `${ x }px`
                        dialog.style.top = `${ y }px`
                    }
                }
            }
        },
        render(h) {
            return h('m-draggable', {
                props: {
                    options: this.dragOptions
                }
            }, [
                h('my-el-dialog', {
                    props: this.$attrs,
                    on: this.$listeners
                }, [
                    ...(this.$slots.default || []),
                    ...(this.$slots.footer || []).map(f => h('span', { staticClass: 'dialog-footer', slot: 'footer' }, f.children))
                ])
            ])
        }
    })
}
