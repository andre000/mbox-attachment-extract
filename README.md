# mbox-attachment-extract

This is a cli tool to extract attachments from .mbox files.

![printscreen](https://i.imgur.com/qC0jtQn.png)

## Installation

Install with npm: `npm i mbox-attachment-extract -g`

## Usage

The command:

`mbox-attachment-extract <<path-to-mbox-file>> <<path-to-extracted-files>>`

Parameters:

`--pattern, -p` Regex to filter attachments. Default: ''

`--filenameAsSubject, -s` Create the attachment with the subject as the filename. Example: fromdomain_subject.zip

`--help` Show the help message

## Demo

![demo](demo.svg)

## Tests

Run the command: `npm t`

## Packages

- [chalk](https://github.com/chalk/chalk)
- [meow](https://github.com/sindresorhus/meow)
- [ora](https://github.com/sindresorhus/ora)
- [node-mbox](https://github.com/robertklep/node-mbox)
- [mailparser](https://github.com/nodemailer/mailparser)
