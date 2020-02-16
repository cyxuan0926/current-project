// const env = 'dev' // 测试环境
// const env = 'demo' // 演示环境
// const env = 'auth' // 认证授权
// const env = 'master' // 正式环境

// eslint-disable-next-line
const env = BUILD_ENV // 打包时通过 cross-env 设置的变量

const nodeUrl = env === 'test' ? 'http://47.107.245.151:1339' : 'http://192.168.0.180:1339'

// apiHost: 接口ip+端口,
// apiPath: 接口的共同前缀,
// audioUrl: 音频上传地址,
// imageUrl: 图片上传地址,
// fileUrl: 文件上传地址,
// socketUrl: websocket地址

const config = {
  development: {
    apiHost: 'http://192.168.0.41:8085',
    apiPath: '/ywgk-auth',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://192.168.0.41:8085/ywgk-auth/websocket'
  },
  test: {
    publicApiHost: 'http://qa-auth-api.yuwugongkai.com',
    apiHost: 'http://47.107.245.151:8021',
    apiPath: '/ywgk',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://47.107.245.151:8021/ywgk/websocket'
  },
  auth: {
    publicApiHost: 'http://qa-auth-api.yuwugongkai.com',
    apiHost: 'http://192.168.0.182:8088',
    apiPath: '/ywgk-auth',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://192.168.0.182:8088/ywgk-auth/websocket'
  },
  production: {
    publicApiHost: 'https://api.auth.prisonpublic.com',
    apiHost: 'https://www.yuwugongkai.com',
    apiPath: '/ywgk',
    audioUrl: 'https://www.yuwugongkai.com/audio-server/audios',
    // imageUrl: 'http://39.108.185.51:1339/image-server/avatars',
    imageUrl: 'https://www.yuwugongkai.com/image-server/avatars',
    // fileUrl: 'https://www.yuwugongkai.com/image-server',
    videoUrl: 'https://www.yuwugongkai.com/video-server/videos',
    socketUrl: 'wss://www.yuwugongkai.com/ws'
  },
  ybDevelopment: {
    publicApiHost: 'http://qa-auth-api.yuwugongkai.com',
    apiHost: 'http://192.168.0.114:8021',
    apiPath: '',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`
    // socketUrl: 'ws://192.168.0.54:8083/websocket'
  },
  xzyDev: {
    publicApiHost: 'http://qa-auth-api.yuwugongkai.com',
    apiHost: 'http://192.168.0.108:8088',
    apiPath: '',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`
    // socketUrl: 'ws://192.168.0.54:8083/websocket'
  },
  phl: {
    publicApiHost: 'http://qa-auth-api.yuwugongkai.com',
    apiHost: 'http://192.168.0.188:8088',
    apiPath: '',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`
    // socketUrl: 'ws://192.168.0.54:8083/websocket'
  }
}

const option = {
  token: '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
}

export let deleteMediaUrl = env === 'production'
  ? 'https://www.yuwugongkai.com/image-server/delete/resources'
  : `${ nodeUrl }/delete/resources`

export default {
  ...config[env],
  ...option
}
