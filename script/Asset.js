class Asset {

    constructor(settings) {
        settings = settings || {};

        this._x = settings.x || 0;
        this._y = settings.y || 0;

        this._select = false;
        this._rotate = settings.rotate || 0;

        this._src = settings.src || "image/tiles/tile_03.png";
        this._img = new Image();
        this._img.src = this._src;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._y = y;
    }

    get img(){
        return this._img;
    }

    set src(url){
        this._src = url;
        this._img.src = url;
    }

    get src(){
        return this._src;
    }

    get select() {
        return this._select;
    }

    set select(select) {
        this._select = select;
    }

    get rotate() {
        return this._rotate;
    }

    set rotate(rotate) {
        this._rotate = rotate;
    }

    draw(size) {
        const x = this.x*size;
        const y = this.y*size;
        const w = size;
        const h = size;
        const center_x = x+w/2;
        const center_y = y+h/2;

        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.translate(-center_x, -center_y);
        ctx.drawImage(this._img,x,y,w,h);
        ctx.restore();

        if (this.select) {
            ctx.strokeStyle = "blue";
            ctx.lineWeight = 3;
            ctx.strokeRect(this.x*size, this.y*size, size, size)
        }
    }
}