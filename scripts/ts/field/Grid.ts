class Grid {
    //#region private

    private _app: App;

    private _grid: PIXI.Container;
    private _parent: PIXI.Container;
    private _cells: any;
    private _cellSize: any;

    private _focus: Focus;

    private _widthPixel: number;
    private _heightPixel: number;

    private _width: number;
    private _height: number;

    private _bombAmount: number;
    private _flagsCounter: number = 0;

    //#endregion


    //#region property

    get focus(): Focus {
        return this._focus;
    }

    //#endregion


    //#region lifecycle

    constructor(parent: PIXI.Container, width: number, height: number, bombAmount: number, app: App) {
        this._app = app;

        this._grid = new PIXI.Container();
        parent.addChild(this._grid);
        this._parent = parent;

        this._focus = new Focus(this._grid);

        this._cellSize = textureLoader.getByKey('cell').orig;

        this._widthPixel = width * this._cellSize.width;
        this._heightPixel = height * this._cellSize.height;

        this._bombAmount = Math.min(bombAmount, width * height);

        this._width = width;
        this._height = height;
    }

    //#endregion


    //#region public methods

    start() {
        this._app.refreshCounter(0, this._bombAmount);
    }

    hide() {
        this._parent.removeChild(this._grid);
    }

    show() {
        this._parent.addChild(this._grid);
    }

    recreate() {
        // delete cells
        for (let i in this._cells) {
            for (let j in this._cells[i]) {
                const cell = this._cells[i][j];
                cell.sprite.parent.removeChild(cell.sprite);
                delete this._cells[i][j];
            }
        }

        this._createCells(this._width, this._height);
        this._chooseBombs();
    }

    canAddFlag() {
        return this._flagsCounter < this._bombAmount;
    }

    increaseFlagsAmount() {
        this._flagsCounter++;
        this._app.refreshCounter(this._flagsCounter, this._bombAmount);

        if (this._flagsCounter === this._bombAmount) {
            this._checkWinning()
        }
    }

    changeInputState(isOn: boolean) {
        for (let i in this._cells) {
            for (let j in this._cells[i]) {
                this._cells[i][j].changeInputState(isOn);
            }
        }
    }

    reduceFlagsAmount() {
        this._flagsCounter--;
        this._app.refreshCounter(this._flagsCounter, this._bombAmount);
    }

    findNearBombs(index: any) {
        const currentCell = this._cells[index[0]][index[1]];

        if (currentCell.isFlag) {
            return;
        }

        // get neigbors cells indexes
        const neighbors = [[index[0] - 1, index[1]], [index[0] - 1, index[1] + 1],
        [index[0], index[1] + 1], [index[0] + 1, index[1] + 1], [index[0] + 1, index[1]],
        [index[0] + 1, index[1] - 1], [index[0], index[1] - 1], [index[0] - 1, index[1] - 1]];
        const notCheckedNeighbors = [];

        let bombsAmount = 0;

        // set current cell checked
        currentCell.checked = true;

        for (let neighborIndex of neighbors) {
            const line = this._cells[neighborIndex[0]];

            if (line) {
                const neighborCell = line[neighborIndex[1]];

                if (neighborCell) {
                    // count bombs amount among neighbors
                    neighborCell.isBomb && bombsAmount++;

                    // if neighbour cell wasn't check then add to special array
                    if (!neighborCell.checked) {
                        !neighborCell.isBomb && !neighborCell.isActive && notCheckedNeighbors.push(neighborIndex);
                        neighborCell.checked = true;
                    }
                }
            }
        }

        if (bombsAmount > 0) {
            // if there is at least one bomb next to cell,
            // set number to cel and stop recursion

            for (let neighborIndex of notCheckedNeighbors) {
                this._cells[neighborIndex[0]][neighborIndex[1]].checked = false;
            }

            currentCell.setBombAmount(bombsAmount);
        } else {
            // if there are no bombs next to cell,
            // set empty sprite (black) and
            // open all cells, that wasn't opened yet 
            // recursion is created
            currentCell.initializeEmpty();

            for (let neighborIndex of notCheckedNeighbors) {
                const neighborCell = this._cells[neighborIndex[0]][neighborIndex[1]];
                neighborCell.checked = true;
                neighborCell.open();
            }
        }
    }

    deactivateCells() {
        for (let i in this._cells) {
            for (let j in this._cells[i]) {
                // 'deactivateWithBomb' mean add bomb sprite if cell is bomb and with flag
                this._cells[i][j].deactivateWithBomb();
            }
        }

        this._app.lose();
    }

    sizeChange(settings: any) {
        const scaleX = settings.GAME_WIDTH / this._widthPixel;
        const scaleY = settings.GAME_HEIGHT / this._heightPixel;

        this._grid.scale.set(Math.min(scaleX, scaleY));

        if (settings.IS_LANDSCAPE) {
            this._grid.y = 0;
            this._grid.x = settings.GAME_WIDTH * .5 - this._grid.scale.x * this._widthPixel * .5;
        } else {
            this._grid.y = settings.GAME_HEIGHT * .5 - this._grid.scale.y * this._heightPixel * .5;
            this._grid.x = 0;
        }
    }

    //#endregion


    //#region private methods

    private _checkWinning() {
        let matchesNumber = 0;

        // check number of matches bomb-flag
        for (let i in this._cells) {
            for (let j in this._cells[i]) {
                const cell = this._cells[i][j];

                if (cell.isBomb && cell.isFlag) {
                    matchesNumber++;
                }
            }
        }

        if (matchesNumber === this._bombAmount) {
            this._app.win();
        }
    }

    private _createCells(width: number, height: number) {
        this._createEmptyCellsArray(width, height);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const cell = new Cell(this._grid, this._app);
                cell.grid = this;
                cell.index = [i, j];

                cell.x = i * this._cellSize.width;
                cell.y = j * this._cellSize.height;

                this._cells[i][j] = cell;
            }
        }
    }

    private _createEmptyCellsArray(width: number, height: number) {
        this._cells = new Array(width);

        for (let i = 0; i < width; i++) {
            this._cells[i] = new Array(height);
        }
    }

    private _chooseBombs() {
        const width = this._cells.length;

        for (let i = 0; i < this._bombAmount; i++) {
            this._createBomb(width);
        }
    }

    private _createBomb(width: number) {
        const randomI = Math.floor(Math.random() * width);
        const randomJ = Math.floor(Math.random() * width);

        if (this._cells[randomI][randomJ].isBomb) {
            this._createBomb(width);
        } else {
            this._cells[randomI][randomJ].setBomb();
        }
    }

    //#endregion
}