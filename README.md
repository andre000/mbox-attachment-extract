# mbox-attachment-extract
[![buddy pipeline](https://app.buddy.works/dev-next/mbox-attachment-extract/pipelines/pipeline/204178/badge.svg?token=97bf4dcd17a1b58262a8a015c9528b9846ee0998e240f0de9322008e604b7df7 "buddy pipeline")](https://app.buddy.works/dev-next/mbox-attachment-extract/pipelines/pipeline/204178)
[![CodeFactor](https://www.codefactor.io/repository/github/andre000/mbox-attachment-extract/badge)](https://www.codefactor.io/repository/github/andre000/mbox-attachment-extract)
[![david-dm](https://david-dm.org/andre000/mbox-attachment-extract.svg)](https://github.com/andre000/mbox-attachment-extract/network/dependencies)

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

![demo](https://github.com/andre000/mbox-attachment-extract/raw/master/demo.svg?sanitize=true)

## Tests

Run the command: `npm t`

## Packages

- [chalk](https://github.com/chalk/chalk)
- [meow](https://github.com/sindresorhus/meow)
- [ora](https://github.com/sindresorhus/ora)
- [node-mbox](https://github.com/robertklep/node-mbox)
- [mailparser](https://github.com/nodemailer/mailparser)
