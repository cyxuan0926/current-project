module.exports = {
  repository: {
    local: true,
    type: 'git',
    url: 'https://github.com/sinog2c/ywgk-fe.git',
    branch: 'auth'
  },

  buildConfig: {
    commands: ['npm ci', 'npm run build:auth'],
    outputDir: 'dist',
    assetsPatterns: ['static', 'index.html']
  },

  remoteOperatesConfig: {
    remotePath: '/mnt/projects/nginx/www'
  },

  connectConfig: {
    host: '192.168.0.180',
    port: 22,
    username: 'root',
    password: 'Nihaoccj123',
  }
};