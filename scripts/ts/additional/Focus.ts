class Focus {
    //#region private

    private _blurFilter: PIXI.filters.BlurFilter;

    //#endregion


    //#region lifecycle

    constructor(target: any) {
        this._blurFilter = new PIXI.filters.BlurFilter();
        this._blurFilter.blur = 0;
        target.filters = [this._blurFilter];
    }

    //#endregion


    //#region public methods

    off () {
        this._blurFilter.blur = 3;
    }

    on () {
        this._blurFilter.blur = 0;
    }
    
    //#endregion
}