module.exports = {
  buildCommands: ["npm install", "npm run build:test"],
  buildOutputPath: "dist",
  repository: {
    name: "prison-web",
    branch: "release",
    url: "https://git.dev.tencent.com/cyxuan0926/prison-web.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "120.78.190.101",
    port: 22,
    username: "root",
    password: "legendEDPywgk02"
  }
};
