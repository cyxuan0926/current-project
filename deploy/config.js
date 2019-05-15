const questions = [
  { type: "input", name: "version", message: "Input app version:" },
  { type: "confirm", name: "isBackup", message: "Backup after deploy?" }
];

module.exports = {
  questions: questions
};
