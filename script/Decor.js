class Decor extends Asset {
    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        /*
            1 -> pas de collision
            2 -> collision pour les characters
            3 -> collisions pour les caracters et les projectiles
        */
        this._collision_type = settings.collision_type || 1; 
        this._small = settings.small || false;

        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `decor_${Object.keys(Decor.data).length}`;
            Decor.data[key] = this;
        }
    }

    set collision_type(collision_type) {
        this._collision_type = collision_type;
    }

    get collision_type() {
        return this._collision_type;
    }

    set small(small){
        this._small = small;
    }

    get small(){
        return this._small;
    }

}