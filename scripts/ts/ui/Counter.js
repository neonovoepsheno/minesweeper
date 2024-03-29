"use strict";
var Counter = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Counter(parent) {
        this._text = new PIXI.Text('20/20');
        this._text.style.fill = 'white';
        parent.addChild(this._text);
        this._focus = new Focus(this._text);
        this._parent = parent;
        this._resize = new Resize(this._text, new Transform(1, 0, 1.8, -50, 20, 1), new Transform(.5, 0, 2.5, 0, 50, .5));
    }
    Object.defineProperty(Counter.prototype, "focus", {
        //#endregion
        //#region property
        get: function () {
            return this._focus;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region public methods
    Counter.prototype.show = function (text) {
        if (text === void 0) { text = ''; }
        this._parent.addChild(this._text);
        text !== '' && (this._text.text = text);
    };
    Counter.prototype.hide = function () {
        this._parent.removeChild(this._text);
    };
    Counter.prototype.refresh = function (current, common) {
        this._text.text = current + '/' + common;
    };
    Counter.prototype.sizeChange = function (settings) {
        this._resize.sizeChange(settings);
    };
    return Counter;
}());
