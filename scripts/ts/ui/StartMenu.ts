class StartMenu {
    //#region private

    private _holder: PIXI.Container;

    private _logo: any;
    private _logoResize: any;

    private _button: any;
    private _buttonResize: any;

    private _tutorial: any;
    private _tutorialResize: any;

    private _parent: PIXI.Container;

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container, app: App) {
        this._holder = new PIXI.Container();

        this._createLogo();
        this._createButton();
        this._createTutorial();

        this._button.on('pointerup', () => {
            app.startGame();
        });

        this._parent = parent;
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
        this._logoResize.sizeChange(settings);
        this._buttonResize.sizeChange(settings);
        this._tutorialResize.sizeChange(settings);
    }

    //#endregion


    //#region private methods

    private _createLogo() {
        this._logo = new PIXI.Sprite(textureLoader.getByKey('logo'));
        this._logoResize = new Resize(this._logo,
            new Transform(.5, .2, 2.25, 0, 0, .5, .5),
            new Transform(.5, .3, 1.75, 0, 0, .5, .5));
        this._holder.addChild(this._logo);
    }

    private _createButton() {
        this._button = new PIXI.Sprite(textureLoader.getByKey('start_button'));
        this._button.interactive = true;
        this._buttonResize = new Resize(this._button,
            new Transform(.5, .7, 1, 0, 0, .5, .5),
            new Transform(.5, .7, 1, 0, 0, .5, .5));
        this._holder.addChild(this._button);
    }

    private _createTutorial() {
        this._tutorial = new PIXI.Container();
        this._tutorialResize = new Resize(this._tutorial,
            new Transform(.5, .5),
            new Transform(.5, .5, 1.5));
        this._holder.addChild(this._tutorial);

        const firstLine = new PIXI.Text('Tap -> open cell');
        firstLine.anchor.set(.5, 1);
        firstLine.style.fill = 'white';

        const secondLine = new PIXI.Text('Double tap -> add flag');
        secondLine.style.fill = 'white';
        secondLine.anchor.x = .5;

        this._tutorial.addChild(firstLine);
        this._tutorial.addChild(secondLine);
    }

    //#endregion
}