module.exports = {
  repository: {
    // local: true,
    type: 'git',
    url: 'http://39.104.53.150/yt/front/ywgk-fe.git',
    branch: 'master'
  },

  buildConfig: {
    commands: ['npm ci', 'npm run build:prod'],
    outputDir: 'dist',
    assetsPatterns: ['static', 'index.html']
  },

  remoteOperatesConfig: {
    remotePath: '/mnt/projects/nginx/www'
  },

  connectConfig: {
    host: '39.108.185.51',
    port: 22,
    username: 'root',
    password: 'GKYT!ssj##',
  }
}
