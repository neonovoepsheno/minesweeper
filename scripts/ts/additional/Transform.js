"use strict";
var Transform = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Transform(x, y, scale, offsetX, offsetY, anchorX, anchorY) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (scale === void 0) { scale = 1; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (anchorX === void 0) { anchorX = 0; }
        if (anchorY === void 0) { anchorY = 0; }
        this.scale = scale;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.x = x;
        this.offsetX = offsetX;
        this.y = y;
        this.offsetY = offsetY;
    }
    return Transform;
}());
