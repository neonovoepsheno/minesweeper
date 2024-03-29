"use strict";
var Cell = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Cell(parent, app) {
        var _this = this;
        //#region private
        this._isBomb = false;
        this._isActive = true;
        this._isFlag = false;
        this._isChecked = false;
        this._canTap = false;
        this._tapCounter = 0;
        this._tapTimer = 0;
        this._sprite = new PIXI.Sprite(textureLoader.getByKey('cell'));
        parent.addChild(this._sprite);
        this._sprite.interactive = true;
        this._sprite.on('pointerup', function () {
            _this.onUp();
        });
        app.createUpdate(function (delta) {
            _this.update(delta);
        });
        this._createFlag();
    }
    Object.defineProperty(Cell.prototype, "x", {
        //#endregion
        //#region property
        set: function (value) {
            this._sprite.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "index", {
        set: function (value) {
            this._index = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "y", {
        set: function (value) {
            this._sprite.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "grid", {
        set: function (value) {
            this._grid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "size", {
        get: function () {
            var textureSize = this._sprite.texture.orig;
            return {
                width: textureSize.width,
                height: textureSize.height,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "isBomb", {
        get: function () {
            return this._isBomb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "isFlag", {
        get: function () {
            return this._isFlag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "checked", {
        get: function () {
            return this._isChecked;
        },
        set: function (value) {
            this._isChecked = value;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region public methods
    Cell.prototype.update = function (dt) {
        // check time between taps on cell to know if it is a double tap or not
        if (this._canTap && this._isActive && this._tapCounter === 1
            && !this._isFlag) {
            this._tapTimer += dt * .01;
            if (this._tapTimer > .02) {
                this.open();
            }
        }
    };
    Cell.prototype.open = function () {
        if (this._isFlag) {
            return;
        }
        this._deactivate();
        if (this._isBomb) {
            this._sprite.addChild(this._bomb);
            this._grid.deactivateCells();
        }
        else {
            this._grid.findNearBombs(this._index);
        }
    };
    Cell.prototype.setBomb = function () {
        this._isBomb = true;
        this._createBomb();
    };
    Cell.prototype.setBombAmount = function (amount) {
        this._createText(amount);
        if (this._isActive) {
            this._deactivate();
        }
    };
    Cell.prototype.initializeEmpty = function () {
        this._sprite.tint = 0;
    };
    Cell.prototype.changeInputState = function (isOn) {
        this._canTap = isOn;
    };
    Cell.prototype.deactivateWithBomb = function () {
        this._deactivate();
        if (this._isBomb) {
            this._sprite.addChild(this._bomb);
            if (this._isFlag) {
                this._isFlag = false;
                this._sprite.removeChild(this._flag);
            }
        }
    };
    //#endregion
    //#region private methods
    Cell.prototype._createText = function (text) {
        var cellText = new PIXI.Text(text);
        cellText.anchor.set(.5);
        this._resetChildSpriteOnCenter(cellText);
        this._sprite.addChild(cellText);
    };
    Cell.prototype._createBomb = function () {
        this._bomb = new PIXI.Sprite(textureLoader.getByKey('bomb'));
        this._bomb.scale.set(.035);
        this._bomb.anchor.set(.5);
        this._resetChildSpriteOnCenter(this._bomb);
    };
    Cell.prototype._createFlag = function () {
        this._flag = new PIXI.Sprite(textureLoader.getByKey('flag'));
        this._flag.scale.set(.1);
        this._flag.anchor.set(.5);
        this._resetChildSpriteOnCenter(this._flag);
    };
    Cell.prototype._resetChildSpriteOnCenter = function (sprite) {
        sprite.y = this.size.height * .5;
        sprite.x = this.size.width * .5;
    };
    Cell.prototype._deactivate = function () {
        this._isActive = false;
        this._sprite.interactive = false;
    };
    Cell.prototype._refreshFlag = function () {
        this._isFlag = !this._isFlag;
        if (this._isFlag) {
            // you can not add flags more then bombs on field amount
            if (this._grid.canAddFlag()) {
                this._sprite.addChild(this._flag);
                this._grid.increaseFlagsAmount();
            }
            else {
                this._isFlag = false;
            }
        }
        else {
            this.checked = false;
            this._sprite.removeChild(this._flag);
            this._grid.reduceFlagsAmount();
        }
    };
    Cell.prototype.onUp = function () {
        if (this._canTap) {
            this._tapCounter++;
            // if double tap add or delete flag
            if (this._tapCounter === 2) {
                this._tapCounter = 0;
                this._tapTimer = 0;
                this._refreshFlag();
            }
        }
    };
    return Cell;
}());
