"use strict";
var App = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function App() {
        this._app = new PIXI.Application();
        this._elementsToSizeChange = [];
        // create all ingame and ui elements, that app need to know about
        // fourth parameter is bomb amount
        this._grid = new Grid(this.stage, 10, 10, 20, this);
        this.addElementToSizeChange(this._grid);
        this._counter = new Counter(this.stage);
        this.addElementToSizeChange(this._counter);
        this._pause = new Pause(this.stage, this);
        this.addElementToSizeChange(this._pause);
        this._pauseMenu = new PauseMenu(this.stage, this);
        this.addElementToSizeChange(this._pauseMenu);
        this._startMenu = new StartMenu(this.stage, this);
        this.addElementToSizeChange(this._startMenu);
    }
    Object.defineProperty(App.prototype, "stage", {
        //#endregion
        //#region property
        get: function () {
            return this._app.stage;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region public methods
    App.prototype.start = function () {
        var _this = this;
        //create pixi app
        this._createApp();
        // initialize grid
        this._grid.start();
        // first resize for app and game elements
        this._sizeChange(utilities.settings);
        // add ticker callback
        this.createUpdate(function (delta) {
            _this.update(delta);
        });
        this.changeIngameInputState(false);
        this.showStartMenu();
    };
    App.prototype.update = function (dt) {
        this._checkResize();
    };
    App.prototype.pause = function () {
        this.changeIngameInputState(false);
        this._grid.focus.off();
        this._counter.focus.off();
        this._pauseMenu.show();
    };
    App.prototype.unpause = function () {
        var _this = this;
        setTimeout(function () {
            _this.changeIngameInputState(true);
        }, 0);
        this._grid.focus.on();
        this._counter.focus.on();
        this._pauseMenu.hide();
    };
    App.prototype.showStartMenu = function () {
        this._grid.focus.on();
        this._counter.focus.on();
        this._hideIngameUI();
        this._grid.hide();
        this._startMenu.show();
    };
    App.prototype.startGame = function () {
        this._startMenu.hide();
        this._pause.show();
        this._counter.show();
        this._grid.show();
        this._grid.recreate();
        this.changeIngameInputState(true);
    };
    App.prototype.addElementToSizeChange = function (element) {
        this._elementsToSizeChange.push(element);
    };
    App.prototype.createUpdate = function (updateFunction) {
        this._app.ticker.add(updateFunction);
    };
    App.prototype.refreshCounter = function (current, common) {
        this._counter.refresh(current, common);
    };
    App.prototype.lose = function () {
        this.changeIngameInputState(false);
        this._hideIngameUI();
        this._counter.show('Lose');
    };
    App.prototype.win = function () {
        this.changeIngameInputState(false);
        this._hideIngameUI();
        this._counter.show('Win');
    };
    App.prototype.changeIngameInputState = function (isOn) {
        this._grid.changeInputState(isOn);
    };
    //#endregion
    //#region public methods
    App.prototype._createApp = function () {
        this._app.renderer.view.style.position = "absolute";
        this._app.renderer.view.style.display = "block";
        this._app.renderer.autoDensity = true;
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._app.view);
    };
    App.prototype._checkResize = function () {
        var settings = utilities.settings;
        if (settings.preSize.height !== window.innerHeight
            || settings.preSize.width !== window.innerWidth) {
            utilities.updateSettings();
            this._sizeChange(settings);
        }
    };
    App.prototype._sizeChange = function (settings) {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
        for (var _i = 0, _a = this._elementsToSizeChange; _i < _a.length; _i++) {
            var element = _a[_i];
            element.sizeChange(settings);
        }
    };
    App.prototype._hideIngameUI = function () {
        this._pauseMenu.hide();
        this._pause.hide();
        this._counter.hide();
    };
    return App;
}());
