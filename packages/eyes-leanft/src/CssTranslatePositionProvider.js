(function() {
    'use strict';

    var EyesSDK = require('eyes.sdk'),
        EyesUtils = require('eyes.utils'),
        EyesLeanFTUtils = require('./EyesLeanFTUtils').EyesLeanFTUtils;
    var PositionProvider = EyesSDK.PositionProvider,
        ArgumentGuard = EyesUtils.ArgumentGuard;

    /**
     * @constructor
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebBrowser} executor
     * @param {PromiseFactory} promiseFactory
     * @augments PositionProvider
     */
    function CssTranslatePositionProvider(logger, executor, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(executor, "executor");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
        this._lastSetPosition = null;
    }

    CssTranslatePositionProvider.prototype = new PositionProvider();
    CssTranslatePositionProvider.prototype.constructor = CssTranslatePositionProvider;

    /**
     * @return {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    CssTranslatePositionProvider.prototype.getCurrentPosition = function () {
        var that = this;
        return that._promiseFactory.makePromise(function (resolve) {
            that._logger.verbose("getCurrentPosition()");
            that._logger.verbose("position to return: ", that._lastSetPosition);
            resolve(that._lastSetPosition);
        });
    };

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @return {Promise<void>}
     */
    CssTranslatePositionProvider.prototype.setPosition = function (location) {
        var that = this;
        that._logger.verbose("Setting position to:", location);
        return EyesLeanFTUtils.translateTo(this._driver, location, this._promiseFactory).then(function () {
            that._logger.verbose("Done!");
            that._lastSetPosition = location;
        });
    };

    /**
     * @return {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    CssTranslatePositionProvider.prototype.getEntireSize = function () {
        var that = this;
        return EyesLeanFTUtils.getEntirePageSize(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Entire size: ", result);
            return result;
        });
    };

    /**
     * @return {Promise<Map<string, string>>}
     */
    CssTranslatePositionProvider.prototype.getState = function () {
        var that = this;
        return EyesLeanFTUtils.getCurrentTransform(this._driver, this._promiseFactory).then(function (transforms) {
            that._logger.verbose("Current transform", transforms);
            return transforms;
        });
    };

    /**
     * @param {Map<string, string>} state The initial state of position
     * @return {Promise<void>}
     */
    CssTranslatePositionProvider.prototype.restoreState = function (state) {
        var that = this;
        return EyesLeanFTUtils.setTransforms(this._driver, state, this._promiseFactory).then(function () {
            that._logger.verbose("Transform (position) restored.");
        });
    };

    exports.CssTranslatePositionProvider = CssTranslatePositionProvider;
}());
