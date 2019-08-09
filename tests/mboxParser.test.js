const fs = require('fs');
const rimraf = require('rimraf');
const mboxParser = require('../src/mboxParser');


const MBOX_PATH = 'tests/sample.mbox';
const ATT_PATH = 'tests/att/';

describe('MBOX File Parser', () => {
  afterEach(() => {
    rimraf.sync(ATT_PATH);
  });

  it('should be able to parse an .mbox file', async () => {
    await mboxParser(MBOX_PATH, ATT_PATH);
    const files = fs.readdirSync(ATT_PATH);
    expect(files.length).toBe(7);
  });

  it('should give the same name to the generated files as the attachemnt', async () => {
    await mboxParser(MBOX_PATH, ATT_PATH);
    const files = fs.readdirSync(ATT_PATH);
    expect(files[0]).toBe('test_file_1.pdf');
  });

  it('should give the domain+subject to the generated files when the correct parameter is defined', async () => {
    await mboxParser(MBOX_PATH, ATT_PATH, false, true);
    const files = fs.readdirSync(ATT_PATH);
    expect(files[0]).toBe('example_Test_Subject_1_0.pdf');
  });

  it('should be able to filter the attachments when defined a pattern', async () => {
    await mboxParser(MBOX_PATH, ATT_PATH, '\\.zip$');
    const files = fs.readdirSync(ATT_PATH);
    expect(files.length).toBe(0);
  });
});
