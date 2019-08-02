class Cell {
    //#region private

    private _isBomb: boolean = false;
    private _isActive: boolean = true;
    private _isFlag: boolean = false;
    private _isChecked: boolean = false;
    private _canTap: boolean = false;

    private _index: any;

    private _sprite: PIXI.Sprite;
    private _flag: any;
    private _bomb: any;

    private _grid: any;

    private _tapCounter: number = 0;
    private _tapTimer: number = 0;

    //#endregion


    //#region property

    set x(value: number) {
        this._sprite.x = value;
    }
    set index(value: any) {
        this._index = value;
    }

    set y(value: number) {
        this._sprite.y = value;
    }

    set grid(value: any) {
        this._grid = value;
    }

    get sprite(): PIXI.Sprite {
        return this._sprite;
    }
    get size(): any {
        const textureSize = this._sprite.texture.orig;

        return {
            width: textureSize.width,
            height: textureSize.height,
        };
    }
    get isBomb(): boolean {
        return this._isBomb;
    }
    get isFlag(): boolean {
        return this._isFlag;
    }

    set checked(value: boolean) {
        this._isChecked = value;
    }
    get checked(): boolean {
        return this._isChecked;
    }

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container, app: App) {
        this._sprite = new PIXI.Sprite(textureLoader.getByKey('cell'));
        parent.addChild(this._sprite);

        this._sprite.interactive = true;
        this._sprite.on('pointerup', () => {
            this.onUp();
        });

        app.createUpdate((delta: number) => {
            this.update(delta)
        });

        this._createFlag();
    }

    //#endregion


    //#region public methods

    update(dt: number) {
        // check time between taps on cell to know if it is a double tap or not
        if (this._canTap && this._isActive && this._tapCounter === 1
            && !this._isFlag) {
            this._tapTimer += dt * .01;

            if (this._tapTimer > .02) {
                this.open();
            }
        }
    }

    open() {
        if (this._isFlag) {
            return;
        }

        this._deactivate();

        if (this._isBomb) {
            this._sprite.addChild(this._bomb);
            this._grid.deactivateCells();
        } else {
            this._grid.findNearBombs(this._index);
        }
    }

    setBomb() {
        this._isBomb = true;
        this._createBomb();
    }

    setBombAmount(amount: string) {
        this._createText(amount);

        if (this._isActive) {
            this._deactivate();
        }
    }

    initializeEmpty() {
        this._sprite.tint = 0;
    }

    changeInputState(isOn: boolean) {
        this._canTap = isOn;
    }

    deactivateWithBomb() {
        this._deactivate();

        if (this._isBomb) {
            this._sprite.addChild(this._bomb);

            if (this._isFlag) {
                this._isFlag = false;
                this._sprite.removeChild(this._flag);
            }
        }
    }

    //#endregion


    //#region private methods

    private _createText(text: string) {
        const cellText = new PIXI.Text(text);
        cellText.anchor.set(.5);

        this._resetChildSpriteOnCenter(cellText);

        this._sprite.addChild(cellText);
    }

    private _createBomb() {
        this._bomb = new PIXI.Sprite(textureLoader.getByKey('bomb'));
        this._bomb.scale.set(.035);
        this._bomb.anchor.set(.5);

        this._resetChildSpriteOnCenter(this._bomb);
    }

    private _createFlag() {
        this._flag = new PIXI.Sprite(textureLoader.getByKey('flag'));
        this._flag.scale.set(.1);
        this._flag.anchor.set(.5);

        this._resetChildSpriteOnCenter(this._flag);
    }

    private _resetChildSpriteOnCenter(sprite: PIXI.Sprite) {
        sprite.y = this.size.height * .5;
        sprite.x = this.size.width * .5;
    }

    private _deactivate() {
        this._isActive = false;
        this._sprite.interactive = false;
    }

    private _refreshFlag() {
        this._isFlag = !this._isFlag;

        if (this._isFlag) {
            // you can not add flags more then bombs on field amount
            if (this._grid.canAddFlag()) {
                this._sprite.addChild(this._flag);
                this._grid.increaseFlagsAmount();
            } else {
                this._isFlag = false;
            }
        } else {
            this.checked = false;
            this._sprite.removeChild(this._flag);
            this._grid.reduceFlagsAmount();
        }
    }

    private onUp() {
        if (this._canTap) {
            this._tapCounter++;

            // if double tap add or delete flag
            if (this._tapCounter === 2) {
                this._tapCounter = 0;
                this._tapTimer = 0;

                this._refreshFlag();
            }
        }
    }
    
    //#endregion
}