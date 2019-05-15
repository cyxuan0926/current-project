const path = require("path");
const sourceDir = path.resolve(__dirname, "../dist");

module.exports = {
  sourceDir,
  outputDir: process.cwd(),
  deployDir: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  // generateFileName,
  server: {
    host: "120.78.190.101",
    port: 22,
    username: "root",
    password: "legendEDPywgk02"
  }
};
