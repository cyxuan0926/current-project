module.exports = {
  local: true,
  buildCommands: ["npm ci", "npm run build:test"],
  buildOutputPath: "dist",
  repository: {
    name: "ywgk-fe",
    branch: "dev",
    url: "https://github.com/sinog2c/ywgk-fe.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "47.107.245.151",
    port: 22,
    username: "root",
    password: "3m4c3n9q8J"
  }
};
