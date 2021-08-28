class Survival {

    static data = {
        1: {
            enemies: [
                { key: "zombie", population: 5 }
            ],
            items: [
                { key: "medical", population: 1 },
                { key: "munition", population: 1 }
            ],
            time_between_waves: 20_000,
            increase_percentage: 0.25
        }
    };
    
    constructor(settings) {
        settings = settings || {};

        this._difficulty = settings.difficulty || 1;
        this._time = Date.now() - this.tick;
        this._wave = 0;
        this._player_distance = 8;
    }

    update() {
        game.update_projectiles();
        game.update_characters();
        game.update_items();

        if (Date.now() > this.time + this.tick) {
            this.time = Date.now();
            this.wave++;

            this.generate();
        }
    }
    
    generate() {
        this.enemies.forEach(item => {
            for(let i =0; i<item.population; i++) {
                const { x, y } = this.random_pos();
                const obj = Object.assign(Character.data[item.key] || {}, { side: 1, x: x, y: y});
                game.characters.push(new Character(obj));
            }
        });

        this.items.forEach(item => {
            for(let i = 0; i<item.population; i++) {
                const { x, y } = this.random_pos();
                const obj = Object.assign(Item.data[item.key] || {}, { x: x, y: y});
                game.items.push(new Item(obj));
            }
        });
    }

    random_pos() {
        const array = Pathfinding.array.filter(item => {
            if (game.distance(item,game.player) <= this.player_distance) return false;
            return true;
        })

        if (!array.length) return { x: 0, y: 0 };

        let index = Math.floor(Math.random() * array.length);

        return { x: array[index].x, y: array[index].y };
    }

    get enemies() {
        return Survival.data[this.difficulty].enemies;
    }

    get items() {
        return Survival.data[this.difficulty].items;
    }

    get tick() {
        return Survival.data[this.difficulty].time_between_waves;
    }

    get increase_percentage() {
        return Survival.data[this.difficulty].increase_percentage;
    }

    // ---

    get difficulty() {
        return this._difficulty;
    }

    set difficulty(difficulty) {
        this._difficulty = difficulty;
    }

    get time() {
        return this._time;
    }

    set time(time) {
        this._time = time;
    }

    get wave() {
        return this._wave;
    }

    set wave(wave) {
        this._wave = wave;
    }

    get player_distance() {
        return this._player_distance;
    }

    set player_distance(player_distance) {
        this._player_distance = player_distance;
    }

}