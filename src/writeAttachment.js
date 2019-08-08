const path = require('path');
const fs = require('fs');

module.exports = (parsedMessage, attachmentPath) => (file, i) => {
  const ext = path.extname(file.filename);
  const from = parsedMessage.from.text.match(/@(.+?)\./);
  const subject = parsedMessage.subject ? parsedMessage.subject.replace(/\W+|\.+/g, '_') : '_';

  const filename = `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}`.length > 200
    ? `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}`.substr(0, 200)
    : `${from[1]}_${subject.replace(/\W+|\.+/g, '_')}_${i}`;

  fs.writeFileSync(`${attachmentPath}${filename}${ext}`, file.content);
};
