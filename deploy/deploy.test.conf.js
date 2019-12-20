module.exports = {
  repository: {
    local: true,
    type: 'git',
    url: 'https://github.com/sinog2c/ywgk-fe.git',
    branch: 'dev'
  },

  buildConfig: {
    commands: ['npm ci', 'npm run build:test'],
    outputDir: 'dist',
    assetsPatterns: ['static', 'index.html']
  },

  remoteOperatesConfig: {
    remotePath: '/mnt/projects/nginx/www'
  },

  connectConfig: {
    host: '47.107.245.151',
    port: 22,
    username: 'root',
    password: '3m4c3n9q8J',
  }
};
