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
        this._sprite = Sprite.get_image(this._src);
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

    get sprite(){
        return this._sprite;
    }

    set src(url){
        this._src = url;
        this._sprite.src = url;
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

    draw(opt) {
        opt = opt || {};
        
        const size = opt.size || game.scale;
        const context = opt.context || ctx;

        const x = this.x*size;
        const y = this.y*size;
        const w = this.w*size;
        const h = this.h*size;
        const center_x = x+w/2;
        const center_y = y+h/2;

        context.save();
        context.translate(center_x, center_y);
        context.rotate(this.rotate * Math.PI / 180);
        context.translate(-center_x, -center_y);
        this.sprite.draw({ context: context,x: x, y : y, w: w,h :h });
        context.restore();

        if (this.select && game.mode === "creative") {
            ctx.strokeStyle = "blue";
            ctx.lineWeight = 3;
            ctx.strokeRect(x+1, y+1, w-2, h-2);
        }
    }

    check_collision(pos){
        if (!pos) pos = {};
        let x = pos.x || this.x;
        let y = pos.y || this.y;
        x = x + this.w/2;
        y = y + this.h/2;

        const check = (item) => {
            return (x >= item.x && x <= item.x+item.w && y >= item.y && y <= item.y+item.h);
        }

        return {
            decors: game.decors.filter(item => check(item)),
            characters: game.characters.filter(item => check(item)),
            projectiles: game.projectiles.filter(item => check(item))
        }
        
    }
}

