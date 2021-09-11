
class Gun extends Attack {

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
        } else {
            game.guns.push(this);
        }
    }


    use() {
        if (!this.is_usable) return;
        
        if (this.parent === game.player) {
            
            if (game.mouse.clic == -1) return;
            const { x, y } = game.mouse_to_pos({ x: game.mouse.x, y: game.mouse.y })
            new Projectile(Object.assign(Projectile.data[this.projectile_key],{ parent_id: this.parent_id, target_x: x, target_y: y}));
            
        } else {

            if (game.distance(this.parent, this.parent.target) > 4) return;
            if (!this.parent.target) { this.target = this.parent.search_enemy(); return; }
            new Projectile(Object.assign(Projectile.data[this.projectile_key] || {},{ parent_id: this.parent_id, target_x: this.parent.target.x, target_y: this.parent.target.y}));
        
        }

        this.bullets -= 1;
        super.use();
    }

    get is_usable() {
        if (!super.is_usable) return false;

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

        if (this.bullets == 0) {
            this.chargers -= 1;
            if (this.chargers > 0) this.bullets = this.chargers_size;
        }

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
        if (chargers < 0) chargers = 0;
        this._chargers = chargers;
        if (this.chargers == 1 && this.bullets == 0) this.bullets = this.chargers_size;
        
    }

}
