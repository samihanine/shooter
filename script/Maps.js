class Maps {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `map_${Object.keys(Maps.data).length}`;

        this._decors = settings.decors.map(item => {
            const decor = new Decor(item)
            return decor;
        });

        Maps.data[this._name] = this;
    }

    get decors() {
        return this._decors;
    }

    set decors(decors) {
        this._decors = decors;
    }
}