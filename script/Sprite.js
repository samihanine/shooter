class Sprite {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `sprite_${Object.keys(Sprite.data).length}`;
        this._src = settings.src || "image/tiles/tile_03.png";
        this._img = new Image();
        this._img.src = this._src;
        this._small = settings.small || false;

        Sprite.data[this._name] = this;
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
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

    set small(small){
        this._small = small;
    }

    get small(){
        return this._small;
    }

    draw({x, y, w, h, r}) {
        r = r || 0;
        const center_x = x+w/2;
        const center_y = y+h/2;

        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(r * Math.PI / 180);
        ctx.translate(-center_x, -center_y);
        ctx.drawImage(this._img,x,y,w,h);
        ctx.restore();
    }

}