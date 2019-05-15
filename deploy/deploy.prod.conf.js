const path = require("path");
const sourceDir = path.resolve(__dirname, "../dist");

module.exports = {
  sourceDir,
  outputDir: process.cwd(),
  deployDir: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  // generateFileName,
  server: {
    host: "39.108.185.51",
    port: 22,
    username: "root",
    password: "Nihaoccj123"
  }
};
