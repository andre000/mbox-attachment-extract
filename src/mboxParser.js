const fs = require('fs');
const { simpleParser } = require('mailparser');
const Mbox = require('node-mbox');

const writeAttachment = require('./writeAttachment');

module.exports = (mboxPath, attachmentPath, pattern = false) => {
  const stream = fs.createReadStream(mboxPath);
  const mbox = new Mbox(stream);
  const fileFilter = pattern ? new RegExp(pattern) : false;

  let count = 0;
  let countFile = 0;

  mbox.on('message', async (message) => {
    count += 1;
    console.clear();
    console.log('===============================');
    console.log(`EMAIL: ${count}`);
    console.log(`ATTACHMENTS: ${countFile}`);
    console.log('===============================');

    const parsedMessage = await simpleParser(message);

    if (parsedMessage.attachments.length === 0) {
      return true;
    }

    const attachment = parsedMessage.attachments.filter((att) => {
      if (!fileFilter) return !!att.filename;

      const canBeExtracted = att.filename && att.filename.match(fileFilter);
      return canBeExtracted;
    });

    if (attachment.length === 0) {
      return true;
    }

    attachment.forEach(writeAttachment(parsedMessage, attachmentPath));
    countFile += attachment.length;

    return true;
  });


  mbox.on('end', () => {
    console.log('DONE!');
    process.exit(0);
  });
};
