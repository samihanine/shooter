
class Spell extends Attack {

    constructor(settings) {
        super(settings);
        this._scope = settings.scope || 1;
        this._cost = settings.cost || 0;

        // adding the object to the data array
        if (settings._template) {
            const key = settings.name || `spell_${Object.keys(Spell.data).length}`;
            Spell.data[key] = this;
        } else {
            game.spells.push(this);
        }
    }

    use() {
        if (!this.is_usable) return;
        
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

    get is_usable(){
        if (!super.is_usable) return false;

        this.target = this.parent.search_enemy();
        if (!this.target) return false;

        let distance = Math.hypot(this.target.x - this.parent.x, this.target.y - this.parent.y);
        if (distance > this.scope) return false;

        return true;
    }

}