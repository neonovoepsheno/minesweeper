"use strict";
var Utilities = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Utilities() {
        this._settings = {};
        this._settings.DEFAULT_WIDTH = 1136;
        this._settings.DEFAULT_HEIGHT = 640;
        this._settings.CURRENT_WIDTH = window.innerWidth;
        this._settings.CURRENT_HEIGHT = window.innerHeight;
        this._settings.PIXEL_RATIO = window.devicePixelRatio || 1;
        this._settings.preSize = {
            width: this._settings.CURRENT_WIDTH,
            height: this._settings.CURRENT_HEIGHT,
        };
        this._settings.WORLD_WIDTH = 1600;
        this._settings.WORLD_HEIGHT = 1600;
        this.updateSettings();
    }
    Object.defineProperty(Utilities.prototype, "settings", {
        //#endregion
        //#region property
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region public methods
    Utilities.prototype.updateSettings = function () {
        this._chooseCurrentSize();
        this.settings.PIXEL_RATIO = window.devicePixelRatio || 1;
        this.settings.IS_LANDSCAPE = this.settings.CURRENT_WIDTH > this.settings.CURRENT_HEIGHT;
        this.settings.GAME_WIDTH = this.settings.CURRENT_WIDTH;
        this.settings.GAME_HEIGHT = this.settings.CURRENT_HEIGHT;
        this.settings.SCALE = this._calculateScale();
        this.settings.INVSCALE = 1 / this.settings.SCALE;
    };
    //#endregion
    //#region private methods
    Utilities.prototype._chooseCurrentSize = function () {
        var currentWidth = window.innerWidth;
        var currentHeight = window.innerHeight;
        if (currentWidth < 1) {
            currentWidth = window.screen.availWidth;
        }
        if (currentHeight < 1) {
            currentHeight = window.screen.availHeight;
        }
        var isLandscape = currentWidth > currentHeight;
        this.settings.CURRENT_WIDTH = currentWidth;
        this.settings.CURRENT_HEIGHT = currentHeight;
        this.settings.preSize = {
            width: this.settings.CURRENT_WIDTH,
            height: this.settings.CURRENT_HEIGHT,
        };
    };
    Utilities.prototype._calculateScale = function () {
        var widthRatio = this.settings.GAME_WIDTH / this._chooseDefaultWidth();
        var heightRatio = this.settings.GAME_HEIGHT / this._chooseDefaultHeight();
        var minRatio = Math.min(widthRatio, heightRatio);
        return minRatio;
    };
    Utilities.prototype._chooseDefaultWidth = function () {
        var width = this.settings.IS_LANDSCAPE ? this.settings.DEFAULT_WIDTH : this.settings.DEFAULT_HEIGHT;
        return width;
    };
    Utilities.prototype._chooseDefaultHeight = function () {
        var height = this.settings.IS_LANDSCAPE ? this.settings.DEFAULT_HEIGHT : this.settings.DEFAULT_WIDTH;
        return height;
    };
    return Utilities;
}());
var utilities = new Utilities();
