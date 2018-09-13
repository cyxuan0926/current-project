export default {
  // 请求地址
  // url: '/',
  // 请求方式
  // method: 'get',
  // 基础url前缀
  // baseURL: 'https://www.yuwugongkai.com/',
  // baseURL: 'http://10.10.10.20:8085/', // 杨波
  // baseURL: 'http://120.78.190.101:8081', // 测试
  baseURL: 'http://120.78.190.101:8085', // 授权
  // baseURL: 'http://120.78.190.101:8083/', // 演示
  // baseURL: 'http://39.108.185.51:8081/',
  // baseURL: 'http://10.10.10.10:8081/', // 黄科
  // baseURL: 'http://10.10.10.103:8081/', // 刘琴
  // baseURL: 'http://10.10.10.18:8081/',
  // 请求发送之前对出参进行处理
  // transformRequest: [data => data],
  // 请求发送之后对入参进行处理
  // transformResponse: [data => data],
  // 设置请求头
  headers: {
    //  'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded'
    // 'Content-Type': 'application/json'
  },
  // post 请求参数
  // data: {},
  // get 请求参数
  // params: {},
  // 设置请求超时时间
  timeout: 10000,
  // 请求数据返回类型
  // responseType: 'json',
  // 设置跨域请求的令牌
  withCredentials: true
  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  // proxy: {
  //   // host: '10.10.10.117',
  //   host: 'www.fushuile.com',
  //   port: 3000
  // },
  // onUploadProgress: function (progressEvent) {
  //   // Do whatever you want with the native progress event
  //   console.log(progressEvent);
  // },
  // onDownloadProgress: function (progressEvent) {
  //   // Do whatever you want with the native progress event
  // },
}
