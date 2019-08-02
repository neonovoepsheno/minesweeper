"use strict";
var Resize = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Resize(target, transformLandscape, transformPortrait) {
        this._transformLandscape = transformLandscape;
        this._transformPortrait = transformPortrait;
        this._target = target;
    }
    //#endregion
    //#region public methods
    Resize.prototype.sizeChange = function (settings) {
        var transform = settings.IS_LANDSCAPE ? this._transformLandscape : this._transformPortrait;
        this._target.scale.set(settings.SCALE * transform.scale);
        this._target.x = settings.GAME_WIDTH * transform.x + transform.offsetX * settings.SCALE;
        this._target.y = settings.GAME_HEIGHT * transform.y + transform.offsetY * settings.SCALE;
        if (this._target.anchor) {
            this._target.anchor.x = transform.anchorX;
            this._target.anchor.y = transform.anchorY;
        }
    };
    return Resize;
}());
