const path = require('path');
const fs = require('fs');
const sanitize = require('sanitize-filename');

module.exports = (parsedMessage, attachmentPath, filenameAsSubject) => (file, i) => {
  let { filename } = file;
  const isWin = process.platform === 'win32';
  const slash = isWin ? '\\' : '/';
  const pathToSave = attachmentPath.match(/[/\\]$/) ? attachmentPath : `${attachmentPath}${slash}`;

  if (filenameAsSubject) {
    const ext = path.extname(filename);
    const from = parsedMessage.from.text.match(/@(.+?)\./);
    const subject = parsedMessage.subject ? parsedMessage.subject.replace(/\W+|\.+/g, '_') : '_';

    filename = sanitize(`${from[1]}_${subject}_${i}${ext}`);
  }

  fs.writeFileSync(`${pathToSave}${sanitize(filename)}`, file.content);
};
