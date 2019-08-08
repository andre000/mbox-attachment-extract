/* eslint-disable no-plusplus */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path')
const { simpleParser } = require('mailparser');
const Mbox = require('node-mbox');

const MBOX_PATH = '';
const ATTACHMENT_PATH = '';

const stream = fs.createReadStream(MBOX_PATH);
const mbox = new Mbox(stream);

let count = 0;
let countFile = 0;

mbox.on('message', async (message) => {
  console.clear();
  console.log('===============================');
  console.log(`EMAIL: ${++count}`);
  console.log(`ATTACHMENTS: ${countFile}`);
  console.log('===============================');

  const parsedMessage = await simpleParser(message);

  if (parsedMessage.attachments.length === 0 ) {
    return true;
  }

  const attachment = parsedMessage.attachments.filter((att) => {
    const canBeExtracted = att.filename
      // && att.filename.match(/\.pdf$|\.zip$|\.rar$/i)
      && att.filename.match(/\.zip$|\.rar$/i);

    return canBeExtracted;
  });

  if (attachment.length === 0) {
    return true;
  }

  attachment.forEach((file, i) => {
    const ext = path.extname(file.filename);
    const from = parsedMessage.from.text.match(/@(.+?)\./);
    const filename = `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`.length > 200
      ? `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`.substr(0, 200)
      : `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`;

    fs.writeFileSync(`${ATTACHMENT_PATH}${filename}${ext}`, file.content);
  });
  countFile += attachment.length;

  return true;
});


mbox.on('end', () => {
  console.log('DONE!');
  process.exit(0);
});

