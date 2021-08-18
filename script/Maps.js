class Maps {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `map_${Object.keys(Sprite.data).length}`;

        this._decors = settings.decors.map(item => {
            const decor = new Decor(Decor.data[item.decor])
            decor.x = item.x;
            decor.y = item.y;
            return decor;
        });

        Maps.data[this._name] = this;
    }

    get decors() {
        return this._decors;
    }
}