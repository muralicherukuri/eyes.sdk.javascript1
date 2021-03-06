'use strict'

const {describe, it, after, before} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../util/start-testcafe-in-mocha')
const startTestServer = require('../util/start-test-server-in-mocha')

describe('Eyes TestCafe Integration', () => {
  let runFileInTestCafe, close
  before(async () => {
    ;({runFileInTestCafe, close} = await startTestCafe())
  })
  after(async () => close())
  startTestServer({after, before, port: 5555})

  it('runs all integration tests in folder "testcafe"', async () => {
    const failedCount = await runFileInTestCafe(path.resolve(__dirname, 'testcafe/*.testcafe.js'))
    expect(failedCount).to.equal(0)
  })
})
