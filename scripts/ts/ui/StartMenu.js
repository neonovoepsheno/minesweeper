"use strict";
var StartMenu = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function StartMenu(parent, app) {
        this._holder = new PIXI.Container();
        this._createLogo();
        this._createButton();
        this._createTutorial();
        this._button.on('pointerup', function () {
            app.startGame();
        });
        this._parent = parent;
    }
    //#endregion
    //#region public methods
    StartMenu.prototype.show = function () {
        this._parent.addChild(this._holder);
    };
    StartMenu.prototype.hide = function () {
        this._parent.removeChild(this._holder);
    };
    StartMenu.prototype.sizeChange = function (settings) {
        this._logoResize.sizeChange(settings);
        this._buttonResize.sizeChange(settings);
        this._tutorialResize.sizeChange(settings);
    };
    //#endregion
    //#region private methods
    StartMenu.prototype._createLogo = function () {
        this._logo = new PIXI.Sprite(textureLoader.getByKey('logo'));
        this._logoResize = new Resize(this._logo, new Transform(.5, .2, 2.25, 0, 0, .5, .5), new Transform(.5, .3, 1.75, 0, 0, .5, .5));
        this._holder.addChild(this._logo);
    };
    StartMenu.prototype._createButton = function () {
        this._button = new PIXI.Sprite(textureLoader.getByKey('start_button'));
        this._button.interactive = true;
        this._buttonResize = new Resize(this._button, new Transform(.5, .7, 1, 0, 0, .5, .5), new Transform(.5, .7, 1, 0, 0, .5, .5));
        this._holder.addChild(this._button);
    };
    StartMenu.prototype._createTutorial = function () {
        this._tutorial = new PIXI.Container();
        this._tutorialResize = new Resize(this._tutorial, new Transform(.5, .5), new Transform(.5, .5, 1.5));
        this._holder.addChild(this._tutorial);
        var firstLine = new PIXI.Text('Tap -> open cell');
        firstLine.anchor.set(.5, 1);
        firstLine.style.fill = 'white';
        var secondLine = new PIXI.Text('Double tap -> add flag');
        secondLine.style.fill = 'white';
        secondLine.anchor.x = .5;
        this._tutorial.addChild(firstLine);
        this._tutorial.addChild(secondLine);
    };
    return StartMenu;
}());
