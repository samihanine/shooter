class Capacity {

    static data = {}

    constructor(settings) {
        settings = settings || {};

        this._img = new Image();
        this._src = settings.src;
        this._img.src = this._src;

        this._tick = settings.tick || 200;
        this._time = Date.now();
        this._parent = settings.parent || null;
        this._sound = settings.sound || "";
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

    set tick(tick){
        this._tick = tick;
    }

    get tick(){
        return this._tick;
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

    set parent(parent){
        this._parent = parent;
    }

    get parent(){
        return this._parent;
    }

    get isUsable() {
        return (Date.now() - this.time > this.tick);
    }

    set target(target){
        if (this.parent) this.parent.target = target;
    }

    get target(){
        return this.parent?.target;
    }

    use() {
        this.time = Date.now();
    }
}

class Gun extends Capacity {

    constructor(settings) {
        super(settings);
        
        settings = settings || {};
        this._projectile_key = settings.projectile_key || "";
        this._chargers_size = settings.chargers_size || 8;
        this._bullets = settings._bullets || this._chargers_size;

        this._chargers = settings._chargers || 3;

        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `gun_${Object.keys(Gun.data).length}`;
            Gun.data[key] = this;
        }
    }


    use() {
        if (!this.isUsable) return;
        
        
        if (this.parent === game.player) {
            
            if (game.mouse.clic == -1) return;
            const { x, y } = game.mouse_to_pos({ x: game.mouse.x, y: game.mouse.y })
            const projectile = new Projectile(Object.assign(Projectile.data[this.projectile_key],{ parent: this.parent, target_x: x, target_y: y}));
            game.projectiles.push(projectile);

        } else {
                    
            if (!this.parent.target) { this.target = this.parent.search_enemy(); return; }
            const projectile = new Projectile(Object.assign(Projectile.data[this.projectile_key] || {},{ parent: this.parent, target_x: this.parent.target.x, target_y: this.parent.target.y}));
            game.projectiles.push(projectile);
        
        }

        this.bullets -= 1;
        super.use();
    }

    get isUsable() {
        if (!super.isUsable) return false;

        if (this.chargers <= 0 && this.bullets <= 0) return false;

        return true;
    }

    set projectile_key(projectile_key){
        this._projectile_key = projectile_key;
    }

    get projectile_key(){
        return this._projectile_key;
    }

    get bullets(){
        return this._bullets;
    }

    set bullets(bullets){
        this._bullets = bullets;

        if (this._bullets == 0) this.chargers -= 1;

        if (this.parent == game.player) {
            game.ui.update_bullets(this);
        }
    }

    get chargers_size(){
        return this._chargers_size;
    }

    set chargers_size(chargers_size){
        this._chargers_size = chargers_size;
    }

    get chargers(){
        return this._chargers;
    }

    set chargers(chargers){
        this._chargers = chargers;

        if (this._chargers > 0) this.bullets = this.chargers_size;
    }


}

class Spell extends Capacity {

    constructor(settings) {
        super(settings);
        this._scope = settings.scope || 1;
        this._cost = settings.cost || 0;

        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `spell_${Object.keys(Spell.data).length}`;
            Spell.data[key] = this;
        }
    }

    use() {
        if (!this.isUsable) return;
        
        if (this.parent == game.player && !game.key[49]) {
            return;
        }

        this.target.life -= this.parent.damage;

        super.use();
    }

    set scope(scope){
        this._scope = scope;
    }

    get scope(){
        return this._scope;
    }

    set cost(cost){
        this._cost = cost;
    }

    get cost(){
        return this._cost;
    }

    get isUsable(){
        if (!super.isUsable) return false;

        this.target = this.parent.search_enemy();
        if (!this.target) return false;

        let distance = Math.hypot(this.target.x - this.parent.x, this.target.y - this.parent.y);
        if (distance > this.scope) return false;

        return true;
    }

}