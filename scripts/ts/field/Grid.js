"use strict";
var Grid = /** @class */ (function () {
    //#endregion
    //#region lifecycle
    function Grid(parent, width, height, bombAmount, app) {
        this._flagsCounter = 0;
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
    Object.defineProperty(Grid.prototype, "focus", {
        //#endregion
        //#region property
        get: function () {
            return this._focus;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region public methods
    Grid.prototype.start = function () {
        this._app.refreshCounter(0, this._bombAmount);
    };
    Grid.prototype.hide = function () {
        this._parent.removeChild(this._grid);
    };
    Grid.prototype.show = function () {
        this._parent.addChild(this._grid);
    };
    Grid.prototype.recreate = function () {
        // delete cells
        for (var i in this._cells) {
            for (var j in this._cells[i]) {
                var cell = this._cells[i][j];
                cell.sprite.parent.removeChild(cell.sprite);
                delete this._cells[i][j];
            }
        }
        this._createCells(this._width, this._height);
        this._chooseBombs();
    };
    Grid.prototype.canAddFlag = function () {
        return this._flagsCounter < this._bombAmount;
    };
    Grid.prototype.increaseFlagsAmount = function () {
        this._flagsCounter++;
        this._app.refreshCounter(this._flagsCounter, this._bombAmount);
        if (this._flagsCounter === this._bombAmount) {
            this._checkWinning();
        }
    };
    Grid.prototype.changeInputState = function (isOn) {
        for (var i in this._cells) {
            for (var j in this._cells[i]) {
                this._cells[i][j].changeInputState(isOn);
            }
        }
    };
    Grid.prototype.reduceFlagsAmount = function () {
        this._flagsCounter--;
        this._app.refreshCounter(this._flagsCounter, this._bombAmount);
    };
    Grid.prototype.findNearBombs = function (index) {
        var currentCell = this._cells[index[0]][index[1]];
        if (currentCell.isFlag) {
            return;
        }
        // get neigbors cells indexes
        var neighbors = [[index[0] - 1, index[1]], [index[0] - 1, index[1] + 1],
            [index[0], index[1] + 1], [index[0] + 1, index[1] + 1], [index[0] + 1, index[1]],
            [index[0] + 1, index[1] - 1], [index[0], index[1] - 1], [index[0] - 1, index[1] - 1]];
        var notCheckedNeighbors = [];
        var bombsAmount = 0;
        // set current cell checked
        currentCell.checked = true;
        for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
            var neighborIndex = neighbors_1[_i];
            var line = this._cells[neighborIndex[0]];
            if (line) {
                var neighborCell = line[neighborIndex[1]];
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
            for (var _a = 0, notCheckedNeighbors_1 = notCheckedNeighbors; _a < notCheckedNeighbors_1.length; _a++) {
                var neighborIndex = notCheckedNeighbors_1[_a];
                this._cells[neighborIndex[0]][neighborIndex[1]].checked = false;
            }
            currentCell.setBombAmount(bombsAmount);
        }
        else {
            // if there are no bombs next to cell,
            // set empty sprite (black) and
            // open all cells, that wasn't opened yet 
            // recursion is created
            currentCell.initializeEmpty();
            for (var _b = 0, notCheckedNeighbors_2 = notCheckedNeighbors; _b < notCheckedNeighbors_2.length; _b++) {
                var neighborIndex = notCheckedNeighbors_2[_b];
                var neighborCell = this._cells[neighborIndex[0]][neighborIndex[1]];
                neighborCell.checked = true;
                neighborCell.open();
            }
        }
    };
    Grid.prototype.deactivateCells = function () {
        for (var i in this._cells) {
            for (var j in this._cells[i]) {
                // 'deactivateWithBomb' mean add bomb sprite if cell is bomb and with flag
                this._cells[i][j].deactivateWithBomb();
            }
        }
        this._app.lose();
    };
    Grid.prototype.sizeChange = function (settings) {
        var scaleX = settings.GAME_WIDTH / this._widthPixel;
        var scaleY = settings.GAME_HEIGHT / this._heightPixel;
        this._grid.scale.set(Math.min(scaleX, scaleY));
        if (settings.IS_LANDSCAPE) {
            this._grid.y = 0;
            this._grid.x = settings.GAME_WIDTH * .5 - this._grid.scale.x * this._widthPixel * .5;
        }
        else {
            this._grid.y = settings.GAME_HEIGHT * .5 - this._grid.scale.y * this._heightPixel * .5;
            this._grid.x = 0;
        }
    };
    //#endregion
    //#region private methods
    Grid.prototype._checkWinning = function () {
        var matchesNumber = 0;
        // check number of matches bomb-flag
        for (var i in this._cells) {
            for (var j in this._cells[i]) {
                var cell = this._cells[i][j];
                if (cell.isBomb && cell.isFlag) {
                    matchesNumber++;
                }
            }
        }
        if (matchesNumber === this._bombAmount) {
            this._app.win();
        }
    };
    Grid.prototype._createCells = function (width, height) {
        this._createEmptyCellsArray(width, height);
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var cell = new Cell(this._grid, this._app);
                cell.grid = this;
                cell.index = [i, j];
                cell.x = i * this._cellSize.width;
                cell.y = j * this._cellSize.height;
                this._cells[i][j] = cell;
            }
        }
    };
    Grid.prototype._createEmptyCellsArray = function (width, height) {
        this._cells = new Array(width);
        for (var i = 0; i < width; i++) {
            this._cells[i] = new Array(height);
        }
    };
    Grid.prototype._chooseBombs = function () {
        var width = this._cells.length;
        for (var i = 0; i < this._bombAmount; i++) {
            this._createBomb(width);
        }
    };
    Grid.prototype._createBomb = function (width) {
        var randomI = Math.floor(Math.random() * width);
        var randomJ = Math.floor(Math.random() * width);
        if (this._cells[randomI][randomJ].isBomb) {
            this._createBomb(width);
        }
        else {
            this._cells[randomI][randomJ].setBomb();
        }
    };
    return Grid;
}());
