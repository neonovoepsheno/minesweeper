class App {
    //#region private

    private _app: any;
    private _elementsToSizeChange: any;

    private _grid: Grid;

    private _counter: Counter;
    private _pause: Pause;
    private _pauseMenu: PauseMenu;
    private _startMenu: StartMenu;

    //#endregion


    //#region property

    get stage(): any {
        return this._app.stage;
    }

    //#endregion


    //#region lifecycle

    constructor() {
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

    //#endregion


    //#region public methods

    start() {
        //create pixi app
        this._createApp();

        // initialize grid
        this._grid.start();

        // first resize for app and game elements
        this._sizeChange(utilities.settings);

        // add ticker callback
        this.createUpdate((delta: number) => {
            this.update(delta)
        });

        this.changeIngameInputState(false);
        this.showStartMenu();
    }

    update(dt: number) {
        this._checkResize();
    }

    pause() {
        this.changeIngameInputState(false);

        this._grid.focus.off();
        this._counter.focus.off();

        this._pauseMenu.show();
    }

    unpause() {
        setTimeout(() => {
            this.changeIngameInputState(true);
        }, 0);

        this._grid.focus.on();
        this._counter.focus.on();

        this._pauseMenu.hide();
    }

    showStartMenu() {
        this._grid.focus.on();
        this._counter.focus.on();

        this._hideIngameUI();
        this._grid.hide();

        this._startMenu.show();
    }

    startGame() {
        this._startMenu.hide();

        this._pause.show();
        this._counter.show();

        this._grid.show();
        this._grid.recreate();

        this.changeIngameInputState(true);
    }

    addElementToSizeChange(element: any) {
        this._elementsToSizeChange.push(element);
    }

    createUpdate(updateFunction: any) {
        this._app.ticker.add(updateFunction);
    }

    refreshCounter(current: number, common: number) {
        this._counter.refresh(current, common);
    }

    lose() {
        this.changeIngameInputState(false);
        this._hideIngameUI();

        this._counter.show('Lose');
    }

    win() {
        this.changeIngameInputState(false);
        this._hideIngameUI();

        this._counter.show('Win');
    }

    changeIngameInputState(isOn: boolean) {
        this._grid.changeInputState(isOn);
    }
    
    //#endregion


    //#region public methods

    private _createApp() {
        this._app.renderer.view.style.position = "absolute";
        this._app.renderer.view.style.display = "block";
        this._app.renderer.autoDensity = true;
        this._app.renderer.resize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._app.view);
    }

    private _checkResize() {
        const settings = utilities.settings;

        if (settings.preSize.height !== window.innerHeight
            || settings.preSize.width !== window.innerWidth) {
            utilities.updateSettings();

            this._sizeChange(settings);
        }
    }

    private _sizeChange(settings: any) {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);

        for (let element of this._elementsToSizeChange) {
            element.sizeChange(settings);
        }
    }

    private _hideIngameUI() {
        this._pauseMenu.hide();
        this._pause.hide();
        this._counter.hide();
    }

    //#endregion
}