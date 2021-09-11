class World {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `world_${Object.keys(World.data).length}`;

        this._decors = []
        
        this._characters = [];
        this._projectiles = [];
        this._items = [];
        this._guns = [];
        this._spells = [];
    
        this._spawn = settings.spawn || {};
        this._difficulty = settings.difficulty || 0;

        World.data[this._name] = this;

        if (settings.decors) settings.decors.map(item => new Decor(item));
        if (settings.characters) settings.characters.map(item => new Character(item))
        if (settings.projectiless) settings.projectiles.map(item => new Projectile(item))
        if (settings.items) settings.items.map(item => new Item(item))
        if (settings.guns) settings.guns.map(item => new Gun(item))
        if (settings.spells) settings.spells.map(item => new Spell(item)) 
    }

    get decors() {
        return this._decors;
    }

    set decors(decors) {
        this._decors = decors;
    }

    get spawn() {
        return this._spawn;
    }

    set spawn(spawn) {
        this._spawn = spawn;
    }

    get difficulty() {
        return this._difficulty;
    }

    set difficulty(difficulty) {
        this._difficulty = difficulty;
    }

    get characters() {
        return this._characters;
    }

    set characters(characters) {
        this._characters = characters;
    }

    get projectiles() {
        return this._projectiles;
    }

    set projectiles(projectiles) {
        this._projectiles = projectiles;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items;
    }

    get guns() {
        return this._guns;
    }

    set guns(guns) {
        this._guns = guns;
    }

    get spells() {
        return this._spells;
    }

    set spells(spells) {
        this._spells = spells;
    }
}