"use strict";
var Pause = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Pause(parent, app) {
        var _this = this;
        this._isPause = false;
        this._icon = new PIXI.Sprite(textureLoader.getByKey('pause'));
        parent.addChild(this._icon);
        this._parent = parent;
        this._app = app;
        this._icon.interactive = true;
        this._icon.on('pointerup', function () {
            _this._isPause = !_this._isPause;
            if (_this._isPause) {
                _this._app.pause();
            }
            else {
                _this._app.unpause();
            }
        });
        this._resize = new Resize(this._icon, new Transform(0, 0, .35), new Transform(1, 0, .4, 0, 0, 1));
    }
    //#endregion
    //#region public methods
    Pause.prototype.sizeChange = function (settings) {
        this._resize.sizeChange(settings);
    };
    Pause.prototype.hide = function () {
        this._parent.removeChild(this._icon);
    };
    Pause.prototype.show = function () {
        this._parent.addChild(this._icon);
    };
    return Pause;
}());
