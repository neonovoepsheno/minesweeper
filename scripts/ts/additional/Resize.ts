class Resize {
    //#region private

    private _transformLandscape: Transform;
    private _transformPortrait: Transform;

    private _target: any;

    //#endregion


    //#region lifecycle

    constructor(target: any, transformLandscape: Transform, transformPortrait: Transform) {
        this._transformLandscape = transformLandscape;
        this._transformPortrait = transformPortrait;

        this._target = target;
    }

    //#endregion

    
    //#region public methods

    sizeChange(settings: any) {
        const transform = settings.IS_LANDSCAPE ? this._transformLandscape : this._transformPortrait;

        this._target.scale.set(settings.SCALE * transform.scale);

        this._target.x = settings.GAME_WIDTH * transform.x + transform.offsetX * settings.SCALE;
        this._target.y = settings.GAME_HEIGHT * transform.y + transform.offsetY * settings.SCALE;

        if (this._target.anchor) {
            this._target.anchor.x = transform.anchorX;
            this._target.anchor.y = transform.anchorY;
        }
    }

    //#endregion
}