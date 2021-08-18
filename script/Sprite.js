class Sprite {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `sprite_${Object.keys(Sprite.data).length}`;

        Sprite.data[this._name] = this;
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
    }

    get rotate() {
        return this._rotate;
    }

    set rotate(rotate) {
        this._rotate = rotate;
    }

}

class Texture extends Sprite {

    constructor(settings) {
        super(settings);
        settings = settings || {};

        this._img = new Image();
        this._img.src = settings.img || "image/tiles/tile_03.png";
    }

    set img(url){
        this._img = url;
    }

    get img(){
        return this._img;
    }

    draw({x, y, w, h, r}) {
        r = r || 0;
        const center_x = x+w/2;
        const center_y = y+h/2;
        
        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(r * Math.PI / 180);
        ctx.translate(-center_x, -center_y);
        ctx.drawImage(this.img,x,y,w,h);
        ctx.restore();
    }

}

class Shape extends Sprite {

    constructor(settings) {
        super(settings);
        settings = settings || {};
        
        this._color = settings.color || "green";
    }

    set color(color){
        this._color = color;
    }

    get color(){
        return this._color;
    }

    draw({x, y, w, h}) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x,y,w,h);
    }

}