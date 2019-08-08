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

  const loadingMessage = () => ` ${chalk.bold('mbox-attachment-extract')}
  ${chalk.cyan('EMAIL:')} ${count}
  ${chalk.cyan('ATTACHMENTS:')} ${countFile}
  `;
  const loader = ora(loadingMessage());

  mbox.on('message', async (message) => {
    loader.start(loadingMessage());

    count += 1;
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
    loader.succeed(`${chalk.green.bold('All files extracted!')}
    Total email parsed: ${count}
    Total files extracted: ${countFile}`);
    process.exit(0);
  });

  mbox.on('error', (err) => {
    console.log('got an error', err);
    loader.fail(`${chalk.redBright.bold('Error: ')} ${err}`);
    process.exit(1);
  });
};
