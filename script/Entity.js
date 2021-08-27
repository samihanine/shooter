class Entity extends Asset {

    static data = {};

    constructor(settings) {
        super(settings);
        settings = settings || {};

        this._speed = settings.speed || 1;
        this._max_life = settings.max_life || 100;
        this._life = settings.max_life;

        this._side = settings.side || 0;
        this._dir = settings.dir || "";
        this._damage = settings.damage || 10;
        this._speed = settings.speed || 0.08;
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

    get life() {
        return this._life;
    }

    set life(life) {
        this._life = life;

        if (this._life <= 0) {
            this._life = 0;
            this.death();
        }

        this.update_ui("life");
    }

    get max_life() {
        return this._max_life;
    }

    set max_life(max_life) {
        this._max_life = max_life > 0 ? max_life : this.max_life;
    }

    /* ---- methods ---- */

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
            if (this instanceof Projectile) {
                if (item.collision_type == 3) operation = false;
            } else if (item.collision_type != 1) operation = false;
        });;

        return operation;
    }

    death() {
        console.log("death");
    }

    search_enemy() {
        let enemy = null;
        let distance = Infinity;

        game.characters.forEach(item => {
            if (item.side != this.side) {
                let temp_distance = Math.hypot(item.x - this.x, item.y - this.y);
                if (temp_distance < distance) {
                    distance = temp_distance;
                    enemy = item;
                }
            }
        })

        return enemy;
    }
}

class Projectile extends Entity {

    static data = {};

    constructor(settings) {
        super(Object.assign(settings, { 
            x: settings?.parent?.x + 0.5,
            y: settings?.parent?.y + 0.5,
            src: settings?.src || "image/entity/projectiles/bullet_a.png",
            side: settings?.parent?.side
        }));
        
        settings = settings || {};

        this._parent = settings.parent;
        this._target_x = settings.target_x || this._x;
        this._target_y = settings.target_y || this._y;
        this._angle = Math.atan2(this._target_y-this._y,this._target_x-this.x);
        this._rotate = (this._angle * 180 / Math.PI) + this._rotate;
        
        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `projectile_${Object.keys(Projectile.data).length}`;
            Projectile.data[key] = this;
        }
    }

    update() {
        this.moove();
        this.collision();
    }

    moove(){
        let x = Math.cos(this.angle)*this.speed;
        let y = Math.sin(this.angle)*this.speed;
        
        if (!this.test_moove({x : this.x + x, y: this.y + y})) this.death();
        this.x += x;
        this.y += y;
    }

    collision() {
        const { characters, projectiles } = this.check_collision();
        const tab = characters.concat(projectiles);

        tab.forEach(item => {
            if (item.side != this.side) {
                item.life -= this.damage;
                this.death();
                return;
            }
        })

    }

    death() {
        let i;
        game.projectiles.forEach((item, index) => {
            if (item === this) i = index;
        })
        game.projectiles.splice(i,1);
    }

    get target_x() {
        return this._target_x;
    }

    set target_x(target_x) {
        this._target_x = target_x;
    }

    get target_y() {
        return this._target_y;
    }

    set target_y(target_y) {
        this._target_y = target_y;
    }

    get angle() {
        return this._angle;
    }

    set angle(angle) {
        this._angle = angle;
    }

}

class Character extends Entity {

    static data = {}

    constructor(settings) {
        super(settings);
        settings = settings || {};
    
        this._pseudo = settings.pseudo || settings.name;

        this._guns = settings.guns || [];
        this._current_gun = 0;
        this._spells = settings.spells || [];
        this._motionless = settings.motionless || false;

        this._target = settings.target || null;
        this.goal = {};
        this.path = [];

        // adding the object to the data array
        if (settings._template) {
            this._template = false;
            const key = settings.name || `character_${Object.keys(Character.data).length}`;
            Character.data[key] = this;
        } else {
            this.ini();
        }
    }

    get motionless() {
        return this._motionless;
    }

    set motionless(motionless) {
        this._motionless = motionless;
    }

    get spells() {
        return this._spells;
    }
    
    set spells(spells) {
        this._spells = spells;
    }

    get guns() {
        return this._guns;
    }
    
    set guns(guns) {
        this._guns = guns;
    }

    get current_gun() {
        return this._current_gun;
    }
    
    set current_gun(current_gun) {
        this._current_gun = current_gun;

        this.update_ui("gun");
    }

    get target() {
        return this._target;
    }

    set target(target) {
        this._target = target;
    }

    get is_player() {
        return this == game.player;
    }

    ini() {
        this._guns = this._guns.map(item => {
            if (!Gun.data[item]) return null;
            return new Gun(Object.assign(Gun.data[item], { parent: this}));
        })

        this._spells = this._spells.map(item => {
            if (!Spell.data[item]) return null
            return new Spell(Object.assign(Spell.data[item], { parent: this }));
        });
    }

    update() {
        this.use_capacities();

        if (this.is_player) {
            this.update_as_player();
        } else {
            this.update_as_bot();
        }
    }

    use_capacities() {
        this.guns[this.current_gun]?.use();
        
        this.spells.forEach(item => item.use());
    }

    update_as_player(){
        this.rotation();

        if (game.key_press == "enter") { 
            this.change_gun();
            game.key_press = "";
        }

        if (this.motionless) return;

        if (game.key[39] || game.key[68]) this.moove_right();
        else if (game.key[38] || game.key[87]) this.moove_up();
        else if (game.key[37] || game.key[65]) this.moove_left();
        else if (game.key[40] || game.key[83]) this.moove_down();
        else return;

        this.target = this.search_enemy();
    }

    reload_path() {
        this.goal.x = Math.round(this.target.x);
        this.goal.y = Math.round(this.target.y);

        let path = new Pathfinding({ 
            start: {x: Math.round(this.x), y: Math.round(this.y)}, 
            end: {x: Math.round(this.target.x), y: Math.round(this.target.y) }
        }).main().reverse();

        if (path.length) this.path = path;
    }

    update_as_bot() {
        if (this.motionless) return;
        if (!this.target) { this.target = this.search_enemy(); return; }

        
        if (!this.goal.x) this.reload_path();
        

        if (!this.path.length) return;

        const x1 = Math.floor(this.x*10)/10;
        const y1 = Math.floor(this.y*10)/10;

        const x2 = this.path[0].x;
        const y2 = this.path[0].y;

        if (x1 !== x2) {
            if (x1 > x2) { 
                this.moove_left();
            }
            else if (x1 < x2) {
                this.moove_right();
            }
        }
        else if (y1 !== y2) {
            if (y1 > y2) {
                this.moove_up();
            }
            else if (y1 < y2) {
                this.moove_down();
            }
        } else {
            this.path.splice(0, 1);
            this.target = this.search_enemy();
            if (Math.hypot(this.goal.x - this.target.x, this.goal.y - this.target.y) > 2) {
                this.reload_path();
            }
            return;
        }
        
        let angle = Math.atan2(y2-y1,x2-x1);
        this._rotate = angle * 180 / Math.PI;
    }

    death() {
        let i;

        game.characters.forEach((item, index) => {
            if (item === this) {
                i = index;
            }
        })

        if (this.side != game.player.side) game.coins += 1;

        game.characters.splice(i,1);


    }

    rotation(){
        if (!game.mouse) return;
        
        const x1 = game.mouse.x;
        const y1 = game.mouse.y;
        const x2 = window.innerWidth/2;
        const y2 = window.innerHeight/2;
        const angle = Math.atan2(y2-y1,x2-x1) * (180/Math.PI);

        this.rotate = angle + 180;
    }

    change_gun() {
        let nb = this.current_gun + 1;
        if (nb == this.guns.length) nb = 0;

        this.current_gun = nb;
    }

    update_ui(text) {
        if (this != game.player) return;

        text = text || "all";

        console.log(text)
        
        if (text == "gun" || text == "all") game.ui.update_gun(this.guns[this.current_gun]);
        if (text == "bullets" || text == "all") game.ui.update_bullets(this.guns[this.current_gun]);
        if (text == "life" || text == "all") game.ui.update_life(this.life/this.max_life*100);
    }

}

