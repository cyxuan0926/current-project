module.exports = {
  buildCommands: ["npm install", "npm run build:prod"],
  buildOutputPath: "dist",
  repository: {
    name: "prison-web",
    branch: "master",
    url: "https://git.dev.tencent.com/cyxuan0926/prison-web.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "39.108.185.51",
    port: 22,
    username: "root",
    password: "Nihaoccj123"
  }
};
