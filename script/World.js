class World {
    static data = {};

    constructor(settings) {
        settings = settings || {};

        this._name = settings.name || `world_${Object.keys(World.data).length}`;

        this._decors = settings.decors ? settings.decors.map(item => new Decor(item)) : [];
        this._characters = settings.characters ? settings.characters.map(item => new Bots(item)) : [];
        this._projectiles = settings.projectiles ? settings.projectiles.map(item => new Projectile(item)) : [];
        this._player = settings.player || new Player();

        World.data[this._name] = this;
    }

    get decors() {
        return this._decors;
    }

    set decors(decors) {
        this._decors = decors;
    }

    get player() {
        return this._player;
    }

    set player(player) {
        this._player = player;
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
}