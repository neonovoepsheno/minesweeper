class Transform {
    //#region public

    scale: number;
    anchorX: number;
    anchorY: number;
    x: number;
    offsetX: number;
    y: number;
    offsetY: number;

    //#endregion


    //#region lifecycle

    constructor(x: number = 0, y: number = 0, scale: number = 1, offsetX: number = 0, offsetY: number = 0, anchorX: number = 0, anchorY: number = 0) {
        this.scale = scale;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.x = x;
        this.offsetX = offsetX;
        this.y = y;
        this.offsetY = offsetY;
    }
    
    //#endregion
}