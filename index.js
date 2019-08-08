/* eslint-disable no-plusplus */

const meow = require('meow');
const chalk = require('chalk');

const mboxParser = require('./src/mboxParser');

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
  hardRejection: true,
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

mboxParser(mboxPath, attachmentPath, pattern);
