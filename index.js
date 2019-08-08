/* eslint-disable no-plusplus */
/* eslint-disable no-console */

const meow = require('meow');
const chalk = require('chalk');

const fs = require('fs');
const path = require('path');
const { simpleParser } = require('mailparser');
const Mbox = require('node-mbox');

const helpMessage = `${chalk.bold('mbox-attachment-extract')}

${chalk.underline.green('Usage:')}
  $ mbox-attachment-extract ${chalk.italic.greenBright('<<path-to-mbox-file>>')} ${chalk.italic.cyanBright('<<path-to-extracted-files>>')} ${chalk.gray('Defaults to "./"')} 

${chalk.underline.green('Options:')}
${chalk.gray('--pattern, -p')} Regex to filter attachments. Default: ''
${chalk.gray('--help')} Prints this help text
${chalk.gray('--version')} Prints the current version

${chalk.underline.green('Example:')}
  mbox-attachment-extract  ${chalk.italic.greenBright('./inbox.mbox')} ${chalk.italic.cyanBright('./files/')}
  mbox-attachment-extract  ${chalk.italic.greenBright('../sent.mbox')} ${chalk.italic.cyanBright('./pdf/')} -p ${chalk.gray('\\.pdf$')}
`;

const cli = meow(helpMessage, {
  hardRejection: false,
  flags: {
    pattern: {
      type: 'string',
      alias: 'p',
    },
  },
});

const { input: [mboxPath, attachmentPath = './'], flags: { pattern } } = cli;

if (!mboxPath) {
  console.error(`${chalk.bold.redBright('Error: The path to the mbox file cannot be empty!')} `);
  console.log(helpMessage);
  process.exit(1);
}

const main = (mboxPath, attachmentPath, pattern = false) => {
  const stream = fs.createReadStream(mboxPath);
  const mbox = new Mbox(stream);
  const fileFilter = pattern ? new RegExp(pattern) : false;

  let count = 0;
  let countFile = 0;

  mbox.on('message', async (message) => {
    console.clear();
    console.log('===============================');
    console.log(`EMAIL: ${++count}`);
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

    attachment.forEach((file, i) => {
      const ext = path.extname(file.filename);
      const from = parsedMessage.from.text.match(/@(.+?)\./);
      const filename = `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`.length > 200
        ? `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`.substr(0, 200)
        : `${from[1]}_${parsedMessage.subject.replace(/\W+|\.+/g, '_')}_${i}`;

      fs.writeFileSync(`${attachmentPath}${filename}${ext}`, file.content);
    });
    countFile += attachment.length;

    return true;
  });


  mbox.on('end', () => {
    console.log('DONE!');
    process.exit(0);
  });
};

main(mboxPath, attachmentPath, pattern);
