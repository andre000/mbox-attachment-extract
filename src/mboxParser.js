/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const { simpleParser } = require('mailparser');
const Mbox = require('node-mbox');
const ora = require('ora');
const chalk = require('chalk');
const pEvent = require('p-event');

const writeAttachment = require('./writeAttachment');

module.exports = async (mboxPath, attachmentPath, pattern = false, filenameAsSubject = false) => {
  const stream = fs.createReadStream(mboxPath);
  const mbox = new Mbox(stream);
  const fileFilter = pattern ? new RegExp(pattern) : false;

  let count = 0;
  let countFile = 0;

  const loadingMessage = (emailRead = 0) => `${chalk.bold('mbox-attachment-extract')}
  ${chalk.cyan('EMAIL:')} ${emailRead}
  ${chalk.cyan('ATTACHMENTS:')} ${countFile}
  `;
  const loader = ora(loadingMessage());

  if (!fs.existsSync(attachmentPath)) {
    fs.mkdirSync(attachmentPath);
  }

  const mboxIterator = pEvent.iterator(mbox, 'message', 'end');

  mbox.on('error', (err) => {
    loader.fail(`${chalk.redBright.bold('Error: ')} ${err}`);
    process.exit(1);
  });

  try {
    for await (const message of mboxIterator) {
      count = mbox.messageCount;
      loader.start(loadingMessage(count));

      const parsedMessage = await simpleParser(message);
      if (parsedMessage.attachments.length === 0) {
        mboxIterator.return();
      }
      const attachment = parsedMessage.attachments.filter((att) => {
        if (!fileFilter) return !!att.filename;
        const canBeExtracted = att.filename && att.filename.match(fileFilter);
        return canBeExtracted;
      });
      if (attachment.length === 0) {
        mboxIterator.return();
      }
      attachment.forEach(writeAttachment(parsedMessage, attachmentPath, filenameAsSubject));
      countFile += attachment.length;
      mboxIterator.return();
    }
  } catch (err) {
    mbox.emit('error', err);
    process.exit(1);
  }

  loader.succeed(`${chalk.green.bold('All files extracted!')}
  Total email parsed: ${chalk.bold(count)}
  Total files extracted: ${chalk.bold(countFile)}
  `);
};
