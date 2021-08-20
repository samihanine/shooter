class Game {

    constructor() {
        this._initial_scale = 50;
        this._scale = this._initial_scale;

        this.key;
        this.mouse;

        this._current_map = "village";

        this.camera = new Camera({speed: this.scale, mode: "creator"});
        this.interface = new Interface();
    }

    load(callback) {
        const json_files = ["entity", "decor", "world"];
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
                    case "entity": new Entity(json[key]); break;
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
        document.onmousedown = (event) => {
            this.mouse = { clic: event.button, x: event.clientX, y: event.clientY };
            
            this.interface.mouse_event(this.camera.mode);
            
        }

        document.onkeydown = (event) => {
            this.key = event.key;

            this.interface.key_event(this.camera.mode);
            if (this.camera.mode === "normal") this.player.key_event();
        }

        this.interface.ini();
    }

    mouse_to_pos({ x, y }){
        return { 
            x: Math.floor(x/this.scale) - Math.floor((this.camera.x+window.innerWidth/2)/this.scale), 
            y: Math.floor(y/this.scale) - Math.floor((this.camera.y+window.innerHeight/2)/this.scale) 
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

    update() {
        ctx.translate(this.camera.x + window.innerWidth/2, this.camera.y+ window.innerHeight/2);
        
        this.draw_map();
        this.draw_player();

        ctx.translate(-this.camera.x, -this.camera.y);
    }

    get decors() {
        return World.data[this.current_map].decors;
    }

    set decors(decors) {
        World.data[this.current_map].decors = decors;
    }

    get player(){
        return World.data[this.current_map].player;
    }

    set player(player){
        World.data[this.current_map].player = player;
    }

    get bots(){
        return World.data[this.current_map].bots;
    }

    set bots(bots){
        World.data[this.current_map].bots = bots;
    }

    get projectiles(){
        return World.data[this.current_map].projectiles;
    }

    set projectiles(projectiles){
        World.data[this.current_map].projectiles = projectiles;
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

    get current_map() {
        return this._current_map;
    }

    set current_map(current_map) {
        this._current_map = current_map;
    }

}