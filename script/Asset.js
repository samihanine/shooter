class Asset {

    constructor(settings) {
        settings = settings || {};

        this._x = settings.x || 0;
        this._y = settings.y || 0;

        this._sprite = settings.sprite || 'blue';

        this._name = settings.name || "unknown";

        this._select = false;
        this._rotate = 0;
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
        Sprite.data[this.sprite]?.draw({x: this.x*size, y: this.y*size, w: size, h: size, r: this.rotate});

        if (this.select) {
            ctx.strokeStyle = "blue";
            ctx.lineWeight = 3;
            ctx.strokeRect(this.x*size, this.y*size, size, size)
        }
    }
}