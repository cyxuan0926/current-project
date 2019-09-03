module.exports = {
  local: true,
  buildCommands: ["npm install", "npm run build:auth"],
  buildOutputPath: "dist",
  repository: {
    name: "ywgk-fe",
    branch: "auth",
    url: "https://github.com/sinog2c/ywgk-fe.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "192.168.0.230",
    port: 22,
    username: "root",
    password: "Nihaoccj123"
  }
};