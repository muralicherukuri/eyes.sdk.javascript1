'use strict';
const getBatch = require('./getBatch');
const createLogger = require('./createLogger');
const makeGetAllResources = require('./getAllResources');
const makeExtractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const makeExtractCssResourcesFromCdt = require('./extractCssResourcesFromCdt');
const createResourceCache = require('./createResourceCache');
const makeGetBundledCssFromCdt = require('./getBundledCssFromCdt');
const makeWaitForRenderedStatus = require('./waitForRenderedStatus');
const makePutResources = require('./putResources');
const makeRenderBatch = require('./renderBatch');
const makeOpenEyes = require('./openEyes');
const makeWaitForTestResults = require('./waitForTestResults');

function makeRenderingGridClient({
  getConfig,
  updateConfig,
  getInitialConfig,
  showLogs,
  renderStatusTimeout,
  renderStatusInterval,
}) {
  let error;
  const logger = createLogger(showLogs);
  const resourceCache = createResourceCache();
  const extractCssResources = makeExtractCssResources(logger);
  const fetchResource = makeFetchResource(logger);
  const extractCssResourcesFromCdt = makeExtractCssResourcesFromCdt(extractCssResources);
  const getBundledCssFromCdt = makeGetBundledCssFromCdt(logger);
  const putResources = makePutResources();
  const renderBatch = makeRenderBatch({putResources, resourceCache});
  const waitForRenderedStatus = makeWaitForRenderedStatus(
    renderStatusTimeout,
    renderStatusInterval,
  );
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
  });

  const openEyes = makeOpenEyes({
    setError,
    getError,
    extractCssResourcesFromCdt,
    getBundledCssFromCdt,
    renderBatch,
    waitForRenderedStatus,
    getAllResources,
    resourceCache,
  });
  const waitForTestResults = makeWaitForTestResults({logger, getError});

  const defaultBatch = getBatch(getInitialConfig());
  logger.log('new default batch', defaultBatch);
  updateConfig(defaultBatch);

  return {
    openEyes: openEyesWithConfig,
    waitForTestResults,
    getError,
  };

  function setError(err) {
    error = err;
  }

  function getError() {
    return error;
  }

  async function openEyesWithConfig(args) {
    const config = getConfig(args);
    return openEyes(config);
  }
}

module.exports = makeRenderingGridClient;
