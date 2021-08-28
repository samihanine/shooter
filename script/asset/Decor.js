class Decor extends Asset {
    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        /*
            1 -> no collision
            2 -> collision for characters
            3 -> collisions for characters and projectiles
        */
        this._collision_type = settings.collision_type || 1; 
        
        this._stack = settings.stack || false;

        /*
            0 -> all
            1 -> sols
            2 -> outside assets
            3 -> interior assets
            4 -> walls
        */
        this._tag = settings.tag || [];


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

    set stack(stack){
        this._stack = stack;
    }

    get stack(){
        return this._stack;
    }

    set tag(tag){
        this._tag = tag;
    }

    get tag(){
        return this._tag;
    }
}