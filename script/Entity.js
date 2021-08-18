class Entity extends Asset {

    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        this._speed = settings.speed || 1;
        this._max_life = settings.max_life || 100;
        this._life = this.life || this._max_life;

        // adding the object to the data array
        if (settings._template) {
            this._template = false;
            const key = settings.name || `entity_${Object.keys(Entity.data).length}`;
            Entity.data[key] = this;
        }
    }

    /* ---- getters & setters ---- */

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

        this._life = this.max_life > life ? life : this.max_life;
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

    set direction(target) {
        this._target = target;
    }

}

class Player extends Entity {

    constructor(settings) {
        super(settings);

        settings = settings || {};

        this._direction = settings.direction;
    }

    get direction() {
        return this._direction;
    }

    set direction(direction) {
        this._direction = direction;
    }

    death() {
        console.log("game over")
        super.death();
    }
    
}