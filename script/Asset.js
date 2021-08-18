class Asset {

    constructor(settings) {
        settings = settings || {};

        this._x = settings.x || 0;
        this._y = settings.y || 0;

        this._sprite = settings.sprite || 'blue';

        this._name = settings.name || "unknown";
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

    get sprite() {
        return this._sprite;
    }

    set sprite(sprite) {
        this._sprite = Sprite.data[sprite] ? sprite : this._sprite;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    draw(size) {
        Sprite.data[this.sprite]?.draw({x: this.x*size, y: this.y*size, w: size, h: size});
    }
}