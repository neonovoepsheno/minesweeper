"use strict";
var Focus = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Focus(target) {
        this._blurFilter = new PIXI.filters.BlurFilter();
        this._blurFilter.blur = 0;
        target.filters = [this._blurFilter];
    }
    //#endregion
    //#region public methods
    Focus.prototype.off = function () {
        this._blurFilter.blur = 3;
    };
    Focus.prototype.on = function () {
        this._blurFilter.blur = 0;
    };
    return Focus;
}());
