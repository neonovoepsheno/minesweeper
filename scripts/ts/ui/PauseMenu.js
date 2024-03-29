"use strict";
var PauseMenu = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function PauseMenu(parent, app) {
        this._holder = new PIXI.Container();
        var playButton = this._createPlayButton();
        var menuButton = this._createMenuButton();
        this._parent = parent;
        this._resize = new Resize(this._holder, new Transform(.5, .5), new Transform(.5, .5));
        playButton.on('pointerup', function () {
            app.unpause();
        });
        menuButton.on('pointerup', function () {
            app.showStartMenu();
        });
    }
    //#endregion
    //#region public methods
    PauseMenu.prototype.show = function () {
        this._parent.addChild(this._holder);
    };
    PauseMenu.prototype.hide = function () {
        this._parent.removeChild(this._holder);
    };
    PauseMenu.prototype.sizeChange = function (settings) {
        this._resize.sizeChange(settings);
    };
    //#endregion
    //#region private methods
    PauseMenu.prototype._createPlayButton = function () {
        var playButton = new PIXI.Sprite(textureLoader.getByKey('play_button'));
        playButton.anchor.set(.5);
        playButton.y = -70;
        playButton.interactive = true;
        this._holder.addChild(playButton);
        return playButton;
    };
    PauseMenu.prototype._createMenuButton = function () {
        var menuButton = new PIXI.Sprite(textureLoader.getByKey('menu_button'));
        menuButton.anchor.set(.5);
        menuButton.y = 70;
        menuButton.interactive = true;
        this._holder.addChild(menuButton);
        return menuButton;
    };
    return PauseMenu;
}());
