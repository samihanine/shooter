class Entity extends Asset {

    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        this._speed = settings.speed || 1;
        this._max_life = settings.max_life || 100;
        this._life = this.life || this._max_life;

        this._side = settings.side || 0;
        this._dir = settings.dir || "";
        this._damage = settings.damage || 10;
        this._speed = settings.speed || 0.1;

        // adding the object to the data array
        if (settings._template) {
            this._template = false;
            const key = settings.name || `entity_${Object.keys(Entity.data).length}`;
            Entity.data[key] = this;
        }
    }

    /* ---- getters & setters ---- */

    get damage() {
        return this._damage;
    }

    set damage(damage) {
        this._damage = damage;
    }

    get side() {
        return this._side;
    }

    set side(side) {
        this._side = side;
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    get dir() {
        return this._dir;
    }

    set dir(dir) {
        this._dir = dir;
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    get life() {
        return this._life;
    }

    set life(life) {
        if (life <= 0) {
            life = 0;
            this.death();
        }

        this._life = (this.max_life > life) ? life : this.max_life;
    }

    get max_life() {
        return this._max_life;
    }

    set max_life(max_life) {
        this._max_life = max_life > 0 ? max_life : this.max_life;
    }

    moove_left(){
        if (this.test_moove({x: this.x - this.speed, y : this.y })) this.x = this.x - this.speed;        
    }

    moove_right(){
        if (this.test_moove({x: this.x + this.speed, y : this.y })) this.x = this.x + this.speed;        
    }

    moove_up(){
        if (this.test_moove({x: this.x, y : this.y - this.speed})) this.y = this.y - this.speed;        
    }

    moove_down(){
        if (this.test_moove({x: this.x, y : this.y + this.speed})) this.y = this.y + this.speed;        
    }

    test_moove({ x , y }){
        let operation = true;
        const array = this.check_collision({x: x, y: y }).decors;
        if (!array.length) operation = false;
        array.forEach(item => {
            if (item.collision) operation = false;
        });;
        return operation;
    }

    /* ---- methods ---- */
    death() {
        console.log("death");
    }
}

/*
    "Projectile" : the entity moves in a straight line towards its target
    "Bot" : the AI control the entity
    "Player" : the player control the entity
    "Static" : the entity never moves
*/

class Projectile extends Entity {

    constructor(settings) {
        super(settings);

        settings = settings || {};

        this._direction = settings.direction;
    }
}

class Bot extends Entity {

    constructor(settings) {
        super(settings);

        settings = settings || {};

        this._target = settings.target || null;
    }
    
    get target() {
        return this._target;
    }

    set target(target) {
        this._target = target;
    }

}

class Player extends Entity {

    constructor(settings) {
        super(settings);

        settings = settings || {};
    }

    update_camera() {
        game.camera.x = -this.x*game.scale;
        game.camera.y = -this.y*game.scale;
    }

    death() {
        super.death();
    }

    key_event(){
        if (game.key[39] || game.key[68]) this.moove_right();
        else if (game.key[38] || game.key[87]) this.moove_up();
        else if (game.key[37] || game.key[65]) this.moove_left();
        else if (game.key[40] || game.key[83]) this.moove_down();
        else return;

        this.update_camera();
        this.collision();
    }

    collision() {
        const { bots, projectiles } = this.check_collision();
    }

    rotation(){
        const x1 = game.mouse.x;
        const y1 = game.mouse.y;
        const x2 = window.innerWidth/2;
        const y2 = window.innerHeight/2;
        const angle = Math.atan2(y2-y1,x2-x1) * (180/Math.PI);

        this.rotate = angle + 180;
    }
    
    update() {
        this.key_event();
        this.rotation();
    }
}