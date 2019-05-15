const path = require("path");
const del = require("del");
const chalk = require("chalk");
const inquirer = require("inquirer");
const program = require("commander");
const Client = require("ssh2").Client;
const { questions } = require("./config");
const {
  compress,
  execRemoteShell,
  putFile,
  generateFileName
} = require("./helper");
const log = console.log;

const generateShellCommands = config => {
  const shellCommands = [];
  const { deployDir, sourcePatterns, fileName, isBackup } = config;

  // 进入部署目录
  shellCommands.push(`cd ${deployDir}\n`);

  // 删除原有的源代码文件
  sourcePatterns.forEach(item => shellCommands.push(`rm -rf ${item}\n`));

  // 解压缩上传的源代码文件
  shellCommands.push(`unzip -o ${fileName}\n`);

  // 删除上传的源代码文件
  !isBackup && shellCommands.push(`rm -rf ${fileName}\n`);

  shellCommands.push(`exit\n`);

  return shellCommands.join("");
};

const generateConfig = config => {
  return new Promise(async (resolve, reject) => {
    try {
      const answer = await inquirer.prompt(questions);
      const { version, isBackup } = answer;

      // zip压缩后的文件名
      if (typeof config.generateFileName === "function") {
        config.fileName = config.generateFileName(version);
      } else {
        config.fileName = generateFileName(version);
      }

      // 压缩文件路径
      config.localFilePath = path.resolve(config.outputDir, config.fileName);
      config.version = version
      config.isBackup = isBackup
      config.shellCommands = generateShellCommands(config); // 压缩文件路径

      log(chalk`\n{bgCyan.black  INFO } {cyan Generate config...}\n`);
      log(`${JSON.stringify(config, null, 2)}\n`);
      resolve(config);
    } catch (err) {
      reject(err);
    }
  });
};

const start = async config => {
  const conn = new Client();

  try {
    const {
      deployDir,
      fileName,
      localFilePath,
      server,
      shellCommands,
      sourceDir
    } = await generateConfig(config);

    await compress(sourceDir, localFilePath); // zip压缩

    conn
      .on("ready", async () => {
        await putFile(conn, localFilePath, `${deployDir}/${fileName}`);
        await execRemoteShell(conn, shellCommands);
        await del.sync(localFilePath);
        conn.end();
        log(
          chalk`{bgGreen.black  DONE }{green  Deployment has been finished.\n}`
        );
      })
      .connect(server);
  } catch (err) {
    conn.end();
    log(err);
    log(chalk.red(err));
  }
};

program
  .option("-c, --config <path>", "specify config file path")
  .parse(process.argv);

if (program.config) {
  configPath = path.resolve(process.cwd(), program.config);
  const config = require(configPath);
  start(config);
} else {
  throw Error("option -c, --config <path> required.");
}
