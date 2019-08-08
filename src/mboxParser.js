const fs = require('fs');
const { simpleParser } = require('mailparser');
const Mbox = require('node-mbox');
const ora = require('ora');
const chalk = require('chalk');

const writeAttachment = require('./writeAttachment');

module.exports = (mboxPath, attachmentPath, pattern = false) => {
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

  console.clear();
  mbox.on('message', async function messageParser(message) {
    count = this.messageCount;
    loader.start(loadingMessage(count));

    try {
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
    } catch (err) {
      this.emit('error', err);
      return false;
    }
  });


  mbox.on('end', () => {
    loader.succeed(`${chalk.green.bold('All files extracted!')}
  Total email parsed: ${chalk.bold(count)}
  Total files extracted: ${chalk.bold(countFile)}
    `);
    process.exit(0);
  });

  mbox.on('error', (err) => {
    loader.fail(`${chalk.redBright.bold('Error: ')} ${err}`);
    process.exit(1);
  });
};
