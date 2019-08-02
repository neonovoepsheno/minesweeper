class PauseMenu {
    //#region private

    private _holder: PIXI.Container; 
    private _parent: PIXI.Container;

    private _resize: Resize;

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container, app: App) {
        this._holder = new PIXI.Container();

        const playButton = this._createPlayButton();
        const menuButton = this._createMenuButton();

        this._parent = parent;

        this._resize = new Resize(this._holder, new Transform(.5, .5), new Transform(.5, .5));
    
        playButton.on('pointerup', () => {
            app.unpause();
        });

        menuButton.on('pointerup', () => {
            app.showStartMenu();
        });
    }

    //#endregion


    //#region public methods

    show() {
        this._parent.addChild(this._holder);
    }

    hide() {
        this._parent.removeChild(this._holder);
    }

    sizeChange(settings: any) {
        this._resize.sizeChange(settings);
    }

    //#endregion


    //#region private methods

    private _createPlayButton() {
        const playButton = new PIXI.Sprite(textureLoader.getByKey('play_button'));
        playButton.anchor.set(.5);
        playButton.y = -70;
        playButton.interactive = true;

        this._holder.addChild(playButton);
        return playButton;
    }

    private _createMenuButton() {
        const menuButton = new PIXI.Sprite(textureLoader.getByKey('menu_button'));
        menuButton.anchor.set(.5);
        menuButton.y = 70;
        menuButton.interactive = true;

        this._holder.addChild(menuButton);
        return menuButton;
    }
    
    //#endregion
}   