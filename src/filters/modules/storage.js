export default {
  storage(size) {
    if (!size && Number(size) !== 0) return ''
    else if (size < 0) return ''

    size = parseInt(size)

    if (size < 1024) return `${ size }B`
    else if (size < 1048576) return `${ Math.round(size * 100 / 1024) / 100 }KB`
    else if (size < 1073741824) return `${ Math.round(size * 100 / 1024 / 1024) / 100 }MB`
    else return `${ Math.round(size * 100 / 1024 / 1024 / 1024) / 100 }GB`
  }
}
