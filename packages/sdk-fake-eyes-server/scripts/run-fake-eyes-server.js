'use strict'

const fakeEyesServer = require('../lib/sdk-fake-eyes-server')

;(async () => {
  const {port} = await fakeEyesServer({
    port: process.env.PORT || 0,
    hangUp: process.env.FAKE_SERVER_HANGUP,
  })
  console.log(`http://localhost:${port}`)
})().catch(err => {
  console.log('err', err)
  process.exit(1)
})
