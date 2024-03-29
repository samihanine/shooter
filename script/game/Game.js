class Game {

    constructor() {
        this.area = document.getElementsByClassName('ratio')[0].getBoundingClientRect();

        this._initial_scale = this.area.height/16;
        this._scale = this._initial_scale;

        this.background_canvas = document.createElement('canvas');
        this.background_padding = { x: 0, y: 0 };

        this._img_load = false;

        this._key = [];
        this._mouse = { clic: -1, x: 0, y: 0 };
        this._key_press = "";

        this._current_world = "village";
        this._camera = new Camera();
        this._ui;
        this._player = null;

        this._mode = "survival";
        this._survival;
        this._creative;

        this._coins = 0;
    }

    load(callback) {
        const json_files = ["character", "projectile", "decor", "world", "gun", "spell", "item", "difficulty"];
        let load = 0; let end = json_files.length;

        const end_load = () => {
            load++;

            if (load === end) {
                this.ini();

                callback && callback();
            }
        }
        
        json_files.forEach(item => this.load_json(item, end_load));
    }

    load_json(name, end_load) {
        fetch(`script/json/${name}.json`)
        .then(response => response.json())
        .catch(e => {
            console.log(`The file ${name}.json was not found.`)
        })
        .then(json => {
            for (const key in json) {
                json[key].name = key;
                json[key]._template = true;

                switch(name){
                    case "decor": new Decor(json[key]); break;
                    case "character": new Character(json[key]); break;
                    case "projectile": new Projectile(json[key]); break;
                    case "world":             
                        if (window.localStorage.getItem("world")) {
                            let obj = Object.assign(json[key],{decors: JSON.parse(window.localStorage.getItem("world") || {})})
                            new World(obj);
                        } else {
                            new World(json[key]); 
                        }
                    break;
                    case "gun": new Gun(json[key]); break;
                    case "spell": new Spell(json[key]); break;
                    case "item": new Item(json[key]); break;
                    case "difficulty": Survival.data[key] = json[key]; break;
                    default:
                        console.log(`The file ${name}.json is not supported by the game.`)
                    break;
                }
            }

            end_load();
        });
        
    }

    ini(){
        this.add_listeners();
        this._survival = new Survival();
        this._creative = new Creative();
        this._ui = new UserInterface();
        this.mode = "survival";

        this.player = this.world.characters.find(item => item.is_player) || this.world.characters[0];

        game.characters.forEach(item => item.ini());
        
        this.player.update_ui();

        this.coins = 15;
    }

    add_listeners(){
        document.onmousedown = (event) => {
            this.mouse = { clic: event.button, x: event.clientX, y: event.clientY };

            const replacer = (key,value) => {
                if (key=="_path" || key=="_target") return undefined;
                else return value;
            }

            return;

            let json = JSON.stringify(this.world, replacer);
            json = json.replaceAll(`"_`,`"`);
            window.localStorage.setItem("save", json);
            game.creative.dl_json(json, "test");

            console.log(window.localStorage.getItem("save"));
        }

        window.addEventListener('keydown', (e) => {
            this.key[e.keyCode] = true;

            if (this.key[32]) {
                this.mode = (this.mode === "survival") ? "creative" : "survival";
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.key[e.keyCode] = false;
        });

        document.addEventListener('keypress', (event) => {
            this.key_press = event.key.toLowerCase();
        }, false);

        document.onmousemove = event => {
            this.mouse = { clic: this.mouse?.clic, x: event.clientX, y: event.clientY };
        }

        window.addEventListener('resize', () => {
            this.area = document.getElementsByClassName('ratio')[0].getBoundingClientRect();
            this.initial_scale = this.area.height/16;
            this.scale = this.initial_scale;

            this.build_map();
        });
    }

    mouse_to_pos({ x, y }){
        let px = (x/this.scale) - (this.camera.x+this.area.width/2+this.area.left)/this.scale;
        let py = (y/this.scale) - (this.camera.y+this.area.height/2+this.area.top)/this.scale;

        return { 
            x: px, 
            y: py
        };
    }


    draw_projectiles(){
        this.projectiles.forEach(item => item.draw());
    }

    update_projectiles(){
        this.projectiles.forEach(item => item.update());
    }

    update_characters(){
        this.characters.forEach(item => item.update());
    }

    update_items(){
        this.items.forEach(item => item.update());
    }

    draw_items(){
        this.items.forEach(item => item.draw());
    }

    draw_characters(){
        this.characters.forEach(item => item.draw());
    }

    draw_map() {
        ctx.drawImage(this.background_canvas,-this.background_padding.x,-this.background_padding.y,this.background_canvas.width,this.background_canvas.height);
    }

    build_map() {
        let max_x = 0; let max_y = 0; let min_x = 0; let min_y = 0;

        this.decors.forEach(item => {
            if (item.x > max_x) max_x = item.x;
            if (item.y > max_y) max_y = item.y;
            if (item.x < min_x) min_x = item.x;
            if (item.y < min_y) min_y = item.y;
        })

        this.background_canvas.width = (max_x + -min_x + 1)*this.scale;
        this.background_canvas.height = (max_y + -min_y + 1)*this.scale;
        
		let ctx2 = this.background_canvas.getContext("2d");
        ctx2.translate(-min_x*this.scale,-min_y*this.scale);

        this.decors.forEach(item => item.draw({ context: ctx2 }));

        this.background_padding = { x: -min_x*this.scale, y: -min_y*this.scale };

        // -----

        let array = [];
        for (let j=min_y; j<max_y; j++) {
            for (let i=min_x; i<max_x; i++) {
                if (this.decors.filter(item => item.x == i && item.y == j).length) {
                    const temp_array = this.decors.filter(item => item.x == i && item.y == j && item.collision_type != 1);
                    if (!temp_array.length) array.push({x: i, y: j, distance: 0});
                }
            }
        }
        Pathfinding.array = array;
    }

    update() {
        if (!this.img_load) return;
        canvas.width = this.area.width;
        canvas.height = this.area.height;

        ctx.translate(this.camera.x + this.area.width/2, this.camera.y + this.area.height/2);

        this.draw_map();
        this.draw_projectiles();
        this.draw_characters();
        this.draw_items();
        this.camera.update();

        if (this.mode === "survival") {
            this.survival.update();
        }

        if (this.mode === "creative") {
            this.creative.update();
        }

        if (this.mouse) this.mouse.clic = -1;
        ctx.translate(-this.camera.x, -this.camera.y);
    }
    
    distance(a,b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    get decors() {
        return this.world.decors;
    }

    set decors(decors) {
        this.world.decors = decors;
    }

    get player(){
        return this._player;
    }

    set player(player){
        this._player = player;
    }

    get characters(){
        return this.world?.characters;
    }

    set characters(characters){
        this.world.characters = characters;
    }

    get projectiles(){
        return this.world.projectiles;
    }

    set projectiles(projectiles){
        this.world.projectiles = projectiles;
    }

    get items(){
        return this.world.items;
    }

    set items(items){
        this.world.items = items;
    }

    get guns(){
        return this.world.guns;
    }

    set guns(guns){
        this.world.guns = guns;
    }

    get spells(){
        return this.world.spells;
    }

    set spells(spells){
        this.world.spells = spells;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = (scale > 0 && scale <= 200) ? scale : this.initial_scale;
        document.getElementById("zoom-text").innerHTML = this._scale;

        if (this.img_load) game.build_map();
    }

    get initial_scale() {
        return this._initial_scale;
    }

    set initial_scale(initial_scale) {
        this._initial_scale = initial_scale;
    }

    get current_world() {
        return this._current_world;
    }

    set current_world(current_world) {
        this._current_map = current_world;
    }

    get key() {
        return this._key;
    }

    set key(key) {
        this._key = key;
    }

    get key_press() {
        return this._key_press;
    }

    set key_press(key_press) {
        this._key_press = key_press;
    }

    get coins() {
        return this._coins;
    }

    set coins(coins) {
        this._coins = coins;

        this.ui.update_coins(coins);
    }

    get mouse() {
        return this._mouse;
    }

    set mouse(mouse) {
        this._mouse = mouse;
    }

    get camera() {
        return this._camera;
    }

    set camera(camera) {
        this._camera = camera;
    }

    get ui() {
        return this._ui;
    }

    set ui(ui) {
        this._ui = ui;
    }

    get img_load() {
        return this._img_load;
    }

    set img_load(img_load) {
        this.build_map();

        this._img_load = img_load;
    }

    get world() {
        return World.data[this.current_world];
    }

    get survival() {
        return this._survival;
    }

    set survival(survival) {
        this._survival = survival;
    }

    get creative() {
        return this._creative;
    }

    set creative(creative) {
        this._creative = creative;
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        const all_mode = ["creative", "survival"];
        
        if (mode === "survival") {
            this.cursor = "https://img.icons8.com/ios-glyphs/20/000000/define-location.png";
        } else {
            this.cursor = "";
        }

        this._mode = all_mode.find((item) => mode == item) ? mode : this._mode;
        this.scale = game.initial_scale;
        this.ui.change_mode();
    }
}