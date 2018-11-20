// const env = 'dev' // 测试环境
// const env = 'demo' // 演示环境
const env = 'auth' // 认证授权
// const env = 'master' // 正式环境
const nodeUrl = 'http://120.78.190.101:1339'

// apiHost: 接口ip+端口,
// apiPath: 接口的共同前缀,
// audioUrl: 音频上传地址,
// imageUrl: 图片上传地址,
// fileUrl: 文件上传地址,
// socketUrl: websocket地址

const config = {
  dev: {
    apiHost: 'http://120.78.190.101:8081',
    apiPath: '/ywgk',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://120.78.190.101:8081/ywgk/websocket'
  },
  auth: {
    apiHost: 'http://120.78.190.101:8085',
    apiPath: '/ywgk-auth',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://120.78.190.101:8085/ywgk-auth/websocket'
  },
  demo: {
    apiHost: 'http://120.78.190.101:8083',
    apiPath: '/ywgk-demo',
    audioUrl: `${ nodeUrl }/audio-server/audios`,
    imageUrl: `${ nodeUrl }/image-server/avatars`,
    // fileUrl: `${ nodeUrl }/image-server`,
    videoUrl: `${ nodeUrl }/video-server/videos`,
    socketUrl: 'ws://120.78.190.101:8083/ywgk-demo/websocket'
  },
  master: {
    apiHost: 'https://www.yuwugongkai.com',
    apiPath: '/ywgk',
    audioUrl: 'https://www.yuwugongkai.com/audio-server/audios',
    imageUrl: 'https://www.yuwugongkai.com/image-server/avatars',
    // fileUrl: 'https://www.yuwugongkai.com/image-server',
    videoUrl: 'https://www.yuwugongkai.com/video-server/videos',
    socketUrl: 'wss://www.yuwugongkai.com/ws'
  }
}

const option = {
  token: '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
}

export let deleteMediaUrl = env === 'master'
  ? 'https://www.yuwugongkai.com/image-server/delete/resources'
  : `${ nodeUrl }/delete/resources`

export default {
  ...config[env],
  ...option
}