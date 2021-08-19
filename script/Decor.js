class Decor extends Asset {
    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        this._collision = settings.collision || false;
        this._small = settings.small || false;

        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `decor_${Object.keys(Decor.data).length}`;
            Decor.data[key] = this;
        }
    }

    set collision(collision) {
        this._collision = collision;
    }

    get collision() {
        return this._collision;
    }

    set small(small){
        this._small = small;
    }

    get small(){
        return this._small;
    }

}