class Utilities {
    //#region private

    private _settings: any;

    //#endregion


    //#region property

    get settings(): any {
        return this._settings;
    }

    //#endregion


    //#region lifecycle

    constructor() {
        this._settings = {};
        this._settings.DEFAULT_WIDTH = 1136;
        this._settings.DEFAULT_HEIGHT = 640;

        this._settings.CURRENT_WIDTH = window.innerWidth;
        this._settings.CURRENT_HEIGHT = window.innerHeight;
        this._settings.PIXEL_RATIO = window.devicePixelRatio || 1;

        this._settings.preSize = {
            width: this._settings.CURRENT_WIDTH,
            height: this._settings.CURRENT_HEIGHT,
        };

        this._settings.WORLD_WIDTH = 1600;
        this._settings.WORLD_HEIGHT = 1600;

        this.updateSettings();
    }

    //#endregion


    //#region public methods

    updateSettings() {
        this._chooseCurrentSize();

        this.settings.PIXEL_RATIO = window.devicePixelRatio || 1;

        this.settings.IS_LANDSCAPE = this.settings.CURRENT_WIDTH > this.settings.CURRENT_HEIGHT;

        this.settings.GAME_WIDTH = this.settings.CURRENT_WIDTH;
        this.settings.GAME_HEIGHT = this.settings.CURRENT_HEIGHT;

        this.settings.SCALE = this._calculateScale();
        this.settings.INVSCALE = 1 / this.settings.SCALE;
    }

    //#endregion


    //#region private methods

    private _chooseCurrentSize() {
        let currentWidth = window.innerWidth;
        let currentHeight = window.innerHeight;

        if (currentWidth < 1) {
            currentWidth = window.screen.availWidth;
        }

        if (currentHeight < 1) {
            currentHeight = window.screen.availHeight;
        }

        const isLandscape = currentWidth > currentHeight;

        this.settings.CURRENT_WIDTH = currentWidth;
        this.settings.CURRENT_HEIGHT = currentHeight;

        this.settings.preSize = {
            width: this.settings.CURRENT_WIDTH,
            height: this.settings.CURRENT_HEIGHT,
        };
    }

    private _calculateScale() {
        const widthRatio = this.settings.GAME_WIDTH / this._chooseDefaultWidth();
        const heightRatio = this.settings.GAME_HEIGHT / this._chooseDefaultHeight();
        const minRatio = Math.min(widthRatio, heightRatio);
        return minRatio;
    }

    private _chooseDefaultWidth() {
        const width = this.settings.IS_LANDSCAPE ? this.settings.DEFAULT_WIDTH : this.settings.DEFAULT_HEIGHT;
        return width;
    }

    private _chooseDefaultHeight() {
        const height = this.settings.IS_LANDSCAPE ? this.settings.DEFAULT_HEIGHT : this.settings.DEFAULT_WIDTH;
        return height;
    }
    
    //#endregion
}

let utilities = new Utilities();