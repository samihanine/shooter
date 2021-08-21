class Game {

    constructor() {
        this._initial_scale = 50;
        this._scale = this._initial_scale;

        this._key = [];
        this._mouse;

        this._current_world = "village";

        this._camera = new Camera();
        this._ui = new UserInterface();
        this._player = null;
    }

    load(callback) {
        const json_files = ["character", "projectile", "decor", "world"];
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
                    case "world": new World(json[key]); break;
                    default:
                        console.log(`The file ${name}.json is not supported by the game.`)
                    break;
                }
            }

            end_load();
        });
        
    }

    ini(){
        this.player = new Player(Object.assign(Character.data["agent"], this.world.player));

        document.onmousedown = (event) => {
            this.mouse = { clic: event.button, x: event.clientX, y: event.clientY };
            this.ui.mouse_event(this.camera.mode);
        }

        window.addEventListener('keydown', (e) => {
            this.key[e.keyCode] = true;

            if (this.key[32]) {
                this.camera.mode = (this.camera.mode === "normal") ? "creator" : "normal";
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.key[e.keyCode] = false;

            
        });

        document.onmousemove = event => {
            this.mouse = { clic: this.mouse?.clic, x: event.clientX, y: event.clientY };
        }

        let zombie = Object.assign(Character.data["zombie"], {target: this.player, side: 2, speed: 0.001});
        this.bots.push(new Bot(zombie))

        this.camera.ini();
        this.ui.ini();
    }

    mouse_to_pos({ x, y }){
        return { 
            x: (x/this.scale) - (this.camera.x+window.innerWidth/2)/this.scale, 
            y: (y/this.scale) - (this.camera.y+window.innerHeight/2)/this.scale
        };
    }

    draw_map() {
        this.decors.forEach(item => {
            item.draw(this.scale);
        })
    }

    draw_player(){
        this.player.draw(this.scale);
    }

    draw_projectiles(){
        this.projectiles.forEach(item => {
            item.draw(this.scale);
        })
    }

    update_projectiles(){
        this.projectiles.forEach(item => {
            item.update();
        })
    }

    update_bots(){
        this.bots.forEach(item => {
            item.update();
        })
    }

    draw_bots(){
        this.bots.forEach(item => {
            item.draw();
        })
    }

    update() {
        ctx.translate(this.camera.x + window.innerWidth/2, this.camera.y+ window.innerHeight/2);
        
        this.draw_map();
        this.draw_player();
        this.draw_projectiles();
        this.draw_bots();

        this.ui.update();

        if (this.camera.mode === "normal") {
            this.player.update();
            this.update_projectiles();
            this.update_bots();
        }

        if (this.mouse) this.mouse.clic = -1;
        ctx.translate(-this.camera.x, -this.camera.y);
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

    get bots(){
        return this.world.bots;
    }

    set bots(bots){
        this.world.bots = bots;
    }

    get projectiles(){
        return this.world.projectiles;
    }

    set projectiles(projectiles){
        this.world.projectiles = projectiles;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = (scale > 0 && scale <= 200) ? scale : this.initial_scale;
        document.getElementById("zoom-text").innerHTML = this._scale;
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

    get world() {
        return World.data[this.current_world];
    }
}