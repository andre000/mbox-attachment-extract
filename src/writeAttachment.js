const path = require('path');
const fs = require('fs');

module.exports = (parsedMessage, attachmentPath, filenameAsSubject) => (file, i) => {
  let { filename } = file;
  const pathToSave = attachmentPath.match(/\/$/) ? attachmentPath : `${attachmentPath}/`;

  if (filenameAsSubject) {
    const ext = path.extname(filename);
    const from = parsedMessage.from.text.match(/@(.+?)\./);
    const subject = parsedMessage.subject ? parsedMessage.subject.replace(/\W+|\.+/g, '_') : '_';

    filename = `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}`.length > 200
      ? `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}`.substr(0, 200)
      : `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}${ext}`;
  }

  fs.writeFileSync(`${pathToSave}${filename}`, file.content);
};
