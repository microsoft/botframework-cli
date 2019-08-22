import {expect, test} from '@oclif/test'
const rimraf = require('rimraf')

describe('The mslg:expand command', () => {
  test
    .stdout()
    .command(['mslg:expand', '--in', 'examples/validExamples/simple.lg', '-t', 'FinalGreeting'])
    .it('should expand specific template successfully', ctx => {
      expect(ctx.stdout).to.contain('# FinalGreeting')
      expect(ctx.stdout).to.contain('- Hi Morning')
      expect(ctx.stdout).to.contain('- Hi Evening')
      expect(ctx.stdout).to.contain('- Hello Morning')
      expect(ctx.stdout).to.contain('- Hello Evening')
    })

  test
    .stdout()
    .command(['mslg:expand', '--in', 'examples/validExamples/simple.lg', '--all'])
    .it('should expand all templates successfully', ctx => {
      expect(ctx.stdout).to.contain('# FinalGreeting')
      expect(ctx.stdout).to.contain('# Greeting')
      expect(ctx.stdout).to.contain('# TimeOfDay')
      expect(ctx.stdout).to.contain('- Hi')
      expect(ctx.stdout).to.contain('- Hello')
      expect(ctx.stdout).to.contain('- Morning')
      expect(ctx.stdout).to.contain('- Evening')
    })

  test
    .stdout()
    .command(['mslg:expand', '--in', 'examples/validExamples/simple.lg', '--inline', '{1+1}'])
    .it('should expand inline expression successfully', ctx => {
      expect(ctx.stdout).to.contain('2')
    })

  test
    .stdout()
    .command(['mslg:expand', '--in', 'examples/validExamples/simpleWithVariables.lg', '-t', 'TimeOfDayWithCondition', '-j', 'examples/validExamples/variables.json'])
    .it('should expand a template with scope and variables successfully', ctx => {
      expect(ctx.stdout).to.contain('# TimeOfDayWithCondition')
      expect(ctx.stdout).to.contain('- Hi Morning')
      expect(ctx.stdout).to.contain('- Hey Morning')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:expand', '--in', 'examples/exceptionExamples/invalidFileType.txt'])
    .it('should output an error for invalid file type', ctx => {
      expect(ctx.stderr).to.contain('Encoding not recognized')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:expand', '--in', 'examples/exceptionExamples/NoNormalTemplateBody.lg'])
    .it('should output an error for no normal template body', ctx => {
      expect(ctx.stderr).to.contain('template body')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:expand', '--in', 'examples/exceptionExamples/InvalidTemplateName.lg'])
    .it('should output an error for invalid token', ctx => {
      expect(ctx.stderr).to.contain('token recognition error')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:expand', '--in', 'examples/exceptionExamples/EmptyLGFile.lg'])
    .it('should output an error for empty file', ctx => {
      expect(ctx.stderr).to.contain('expanding templates or inline expression failed')
    })

  test
    .stdout()
    .stderr()
    .command(['mslg:expand', '--in', 'undefined'])
    .it('should output an error for file name undefined', ctx => {
      expect(ctx.stderr).to.contain('unable to open file: undefined')
    })

    afterEach((done) => {
      rimraf('test/testOutput/*', {}, () => {done()})
    });
})
