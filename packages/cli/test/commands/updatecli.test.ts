import {expect, test} from '@oclif/test'
const path = require('path')
const semver = require('semver')

const upgradeavailable = path.join(__dirname, '../fixtures/upgradeavailable')
const noupgradeavailable = path.join(__dirname, '../fixtures/noupgradeavailable')

describe('it should output a message if an update is available', () => {
  test
    .loadConfig({root: upgradeavailable})
    .stub(semver, 'gt', () => true)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: upgradeavailable})
    .do(output => expect(output.stdout).to.contain('Update available'))
    .it()
})

describe('it should not output anything if no update is available', () => {
  test
    .loadConfig({root: noupgradeavailable})
    .stub(semver, 'gt', () => false)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: noupgradeavailable})
    .do(output => expect(output.stdout).to.equal(''))
    .it()
})
