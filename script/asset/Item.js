class Item extends Asset {
    static data = {};

    constructor(settings) {
        super(settings);

        settings = settings || {};
        this._key = settings.key || "life";
        this._value = settings.value || 1;

        if (settings._template) {
            const key = settings.name || `item_${Object.keys(Item.data).length}`;
            Item.data[key] = this;
        } else {
            game.items.push(this);
        }
    }

    get key() {
        return this._key;
    }

    set key(key) {
        this._key = key;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get target() {
        return this._target;
    }

    set target(target) {
        this._target = target;
    }

    update() {
        if (this.x == Math.floor(game.player.x) && this.y == Math.floor(game.player.y)) {
            this.use();
        }
    }

    use() {
        game.player[this.key] += this.value;
        this.destroy();
    }

    destroy() {
        game.items = game.items.filter(item => item != this);
    }
}