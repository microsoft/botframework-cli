import {expect, test} from '@oclif/test'
const path = require('path')

const upgradeavailable = path.join(__dirname, '../fixtures/upgradeavailable')
const noupgradeavailable = path.join(__dirname, '../fixtures/noupgradeavailable')

describe('it should output a message if an update is available', () => {
  test
    .loadConfig({root: upgradeavailable})
    .stdout()
    .hook('init', {argv: ['arg']}, {root: upgradeavailable})
    .do(output => expect(output.stdout).to.contain('Update available'))
    .it()
})

describe('it should not output anything if no update is available', () => {
  test
    .loadConfig({root: noupgradeavailable})
    .stdout()
    .hook('init', {argv: ['arg']}, {root: noupgradeavailable})
    .do(output => expect(output.stdout).to.equal(''))
    .it()
})
