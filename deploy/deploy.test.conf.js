module.exports = {
  local: true,
  buildCommands: ["npm install", "npm run build:test"],
  buildOutputPath: "dist",
  repository: {
    name: "ywgk-fe",
    branch: "dev",
    url: "https://github.com/sinog2c/ywgk-fe.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "120.79.251.238",
    port: 22,
    username: "root",
    password: "legendEDP02"
  }
};
