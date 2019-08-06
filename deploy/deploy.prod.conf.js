module.exports = {
  buildCommands: ["npm install", "npm run build:prod"],
  buildOutputPath: "dist",
  repository: {
    name: "ywgk-fe",
    branch: "master",
    url: "https://github.com/sinog2c/ywgk-fe.git"
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
