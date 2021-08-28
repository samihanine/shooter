class World {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `world_${Object.keys(World.data).length}`;

        this._decors = settings.decors ? settings.decors.map(item => new Decor(item)) : [];
        this._characters = settings.characters ? settings.characters.map(item => new Bots(item)) : [];
        this._projectiles = settings.projectiles ? settings.projectiles.map(item => new Projectile(item)) : [];
        this._items = settings.items ? settings.items.map(item => new Item(item)) : [];
        
        this._spawn = settings.spawn || {};
        this._difficulty = settings.difficulty || 0;
        

        World.data[this._name] = this;
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
}