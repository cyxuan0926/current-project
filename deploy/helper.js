const fs = require("fs");
const chalk = require("chalk");
const archiver = require("archiver");
const log = console.log;

const formatTime = (
  time = Date.now(),
  format = 'yyyy/MM/dd hh:mm:ss',
  isFillZero = true
) => {
  const date = new Date(time)
  const cell = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let key in cell) {
    if (cell.hasOwnProperty(key)) {
      format = format.replace(new RegExp(key), function (match) {
        return isFillZero ? ('0' + cell[key]).slice(-(match.length)) : cell[key]
      })
    }
  }

  return format
}

const generateFileName = version => {
  return `${version || formatTime(Date.now(), "yyyyMMdd")}.zip`;
};

const compress = (sourceDir, outputFileName) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFileName);
    const archive = archiver("zip", { forceLocalTime: true });

    log(chalk`{bgCyan.black  INFO } {cyan Pack source file...}\n`);

    output.on("finish", () => resolve());
    archive.on("error", err => reject(err));

    archive.on("warning", err => {
      err.code === "ENOENT" ? log(chalk.yellow(err)) : reject(err);
    });

    output.on("close", () => {
      log((archive.pointer() / 1024 / 1024).toFixed(2) + " total MB");
      log("Archiver has been finalized and the output file descriptor has closed.\n");
    });

    archive.pipe(output);
    archive.directory(sourceDir, "/");
    archive.finalize();
  });
};

const execRemoteShell = (conn, shellCode) => {
  return new Promise((resolve, reject) => {
    conn.shell((err, stream) => {
      if (err) reject(err);

      log(
        chalk`{bgCyan.black  INFO } {cyan Execute remote shell command...}\n`
      );
      log(chalk.yellow(shellCode));

      stream
        .on("close", () => {
          log("Shell execute finished.\n");
          resolve();
        })
        .on("data", data => {
          // data.length > 6 && log("OUTPUT: " + data);
        });

      stream.end(shellCode);
    });
  });
};

const putFile = (conn, localFilePath, remoteFilePath) => {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) reject(err);

      sftp.fastPut(localFilePath, remoteFilePath, err => {
        log(chalk`{bgCyan.black  INFO } {cyan Upload file...}\n`);

        if (err) {
          reject(err);
        } else {
          log("Upload file success.\n");
          resolve();
        }
      });
    });
  });
};

module.exports = {
  compress: compress,
  execRemoteShell: execRemoteShell,
  putFile: putFile,
  generateFileName: generateFileName
};
