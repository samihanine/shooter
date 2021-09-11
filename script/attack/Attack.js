class Attack {

    static data = {}

    constructor(settings) {
        settings = settings || {};

        this._src = settings.src;
        this._tick = settings.tick || 200;
        this._time = Date.now();

        this._parent_id = settings.parent_id || -1;
        this._sound = settings.sound || "";
        this._key = settings.key;
    }

    set src(src){
        this._src = src;
    }

    get src(){
        return this._src;
    }

    set key(key){
        this._key = key;
    }

    get key(){
        return this._key;
    }

    set tick(tick){
        this._tick = tick;
    }

    get tick(){
        return this._tick;
    }

    set parent_id(parent_id){
        this._parent_id = parent_id;
    }

    get parent_id(){
        return this._parent_id;
    }

    set sound(sound){
        this._sound = sound;
    }

    get sound(){
        return this._sound;
    }

    set time(time){
        this._time = time;
    }

    get time(){
        return this._time;
    }

    get parent(){
        return Character.getById(this._parent_id);
    }

    set target(target){
        if (this.parent) this.parent.target = target;
    }

    get target(){
        return this.parent?.target;
    }

    get is_usable() {
        return (Date.now() - this.time > this.tick);
    }

    use() {
        this.time = Date.now();
    }
}
