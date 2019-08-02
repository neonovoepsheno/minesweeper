class Counter {
    //#region private

    private _text: PIXI.Text;
    private _parent: PIXI.Container;
    private _focus: Focus;

    private _resize: Resize;

    //#endregion


    //#region property

    get focus(): Focus {
        return this._focus;
    }

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container) {
        this._text = new PIXI.Text('20/20');
        this._text.style.fill = 'white';
        parent.addChild(this._text);

        this._focus = new Focus(this._text);

        this._parent = parent;

        this._resize = new Resize(this._text, new Transform(1, 0, 1.8, -50, 20, 1),
        new Transform(.5, 0, 2.5, 0, 50, .5));
    }

    //#endregion


    //#region public methods

    show(text = '') {
        this._parent.addChild(this._text);

        text !== '' && (this._text.text = text);
    }

    hide() {
        this._parent.removeChild(this._text);
    }

    refresh(current: number, common: number) {
        this._text.text = current + '/' + common;
    }

    sizeChange(settings: any) {
        this._resize.sizeChange(settings);
    }

    //#endregion
}