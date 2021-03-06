'use strict'
const isFeatureEnabled = require('@applitools/feature-flags')
const translateBrowserNameVersion = require('./translateBrowserNameVersion')

function getSupportedBrowsers() {
  // This is a map from the value we get from the user to the value we send to the visual grid
  // user --> VG
  const supportedBrowsers = {
    chrome: 'chrome',
    'chrome-canary': 'chrome-canary',
    firefox: 'firefox',
    ie10: 'ie10',
    ie11: 'ie11',
    edge: 'edge',
    ie: 'ie',
    safari: 'safari',
    [translateBrowserNameVersion('chrome-1')]: 'chrome-1',
    [translateBrowserNameVersion('chrome-2')]: 'chrome-2',
    [translateBrowserNameVersion('firefox-1')]: 'firefox-1',
    [translateBrowserNameVersion('firefox-2')]: 'firefox-2',
    [translateBrowserNameVersion('safari-1')]: 'safari-1',
    [translateBrowserNameVersion('safari-2')]: 'safari-2',
  }

  if (isFeatureEnabled('vg-cli-edge')) {
    supportedBrowsers['edgelegacy'] = 'edgelegacy'
    supportedBrowsers['edgechromium'] = 'edgechromium'
  }

  return supportedBrowsers
}

module.exports = getSupportedBrowsers
