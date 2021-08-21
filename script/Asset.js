class Asset {

    constructor(settings) {
        settings = settings || {};

        this._x = settings.x || 0;
        this._y = settings.y || 0;

        this._w = settings.w || 1;
        this._h = settings.h || 1;

        this._select = false;
        this._rotate = settings.rotate || 0;

        this._src = settings.src || "image/tiles/tile_03.png";
        this._img = new Image();
        this._img.src = this._src;
        this._img_is_load = false;
        this._img.onload = () => {
            this._img_is_load = true;
        }
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = Math.round(x * 1000) / 1000;
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._y = Math.round(y * 1000) / 1000;
    }

    get w() {
        return this._w;
    }

    set w(w) {
        this._w = w;
    }

    get h() {
        return this._h;
    }

    set h(h) {
        this._h = h
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
        if (rotate >= 360) rotate -= 360;
        this._rotate = rotate;
    }

    draw(size) {
        const x = this.x*size;
        const y = this.y*size;
        const w = this.w*size;
        const h = this.h*size;
        const center_x = x+w/2;
        const center_y = y+h/2;

        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.translate(-center_x, -center_y);
        if (this._img_is_load) ctx.drawImage(this._img,x,y,w,h);
        ctx.restore();

        if (this.select && game.camera.mode === "creator") {
            ctx.strokeStyle = "blue";
            ctx.lineWeight = 3;
            ctx.strokeRect(x+1, y+1, w-2, h-2);
        }
    }

    check_collision(pos){
        console.log()
        if (!pos) pos = {};
        let x = pos.x || this.x;
        let y = pos.y || this.y;

        
        x = x + 0.5;
        y = y + 0.5;

        const condition = (x2,y2) => {
            return Math.floor(x2) === Math.floor(x) && Math.floor(y2) == Math.floor(y);
        }

        const check = (item) => {
            return condition(item.x,item.y) || condition(item.x+item.w/2,item.y) || condition(item.x+item.w/2,item.y+item.h/2) || condition(item.x,item.y+item.h/2);
        }

        return {
            decors: game.decors.filter(item => check(item)),
            bots: game.bots.filter(item => check(item)),
            projectiles: game.projectiles.filter(item => check(item))
        }
        
    }
}