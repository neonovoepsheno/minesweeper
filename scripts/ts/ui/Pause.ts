class Pause {
    //#region private

    private _icon: PIXI.Sprite;
    private _parent: PIXI.Container;
    private _app: App;

    private _resize: Resize;

    private _isPause: boolean = false;

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container, app: App) {
        this._icon = new PIXI.Sprite(textureLoader.getByKey('pause'));
        parent.addChild(this._icon);

        this._parent = parent;
        this._app = app;

        this._icon.interactive = true;
        this._icon.on('pointerup', () => {
            this._isPause = !this._isPause;

            if (this._isPause) {
                this._app.pause();
            } else {
                this._app.unpause();
            }
        });

        this._resize = new Resize(this._icon, new Transform(0, 0, .35),
        new Transform(1, 0, .4, 0, 0, 1));
    }

    //#endregion


    //#region public methods

    sizeChange(settings: any) {
        this._resize.sizeChange(settings);
    }

    hide() {
        this._parent.removeChild(this._icon);
    }

    show() {
        this._parent.addChild(this._icon);
    }
    
    //#endregion
}