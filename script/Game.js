class Game {

    constructor() {
        this._initial_scale = 50;
        this._scale = this._initial_scale;

        this.key;
        this.mouse;

        this._current_map = "village";

        this.player = new Player(); 
        this.camera = new Camera({speed: this.scale, mode: "creator"});
        this.interface = new Interface();
    }

    load(callback) {
        const json_files = ["bot", "player", "decor","maps"];
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
                    case "bot": new Bot(json[key]); break;
                    case "decor": new Decor(json[key]); break;
                    case "player": new Player(json[key]); break;
                    case "maps": new Maps(json[key]); break;
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
        }

        this.interface.ini();
    }

    mouse_to_pos({ x, y }){
        return { 
            x: Math.floor(x/this.scale) - Math.floor(this.camera.x/this.scale), 
            y: Math.floor(y/this.scale) - Math.floor(this.camera.y/this.scale)
        };
    }

    draw_map() {
        this.decors.forEach(item => {
            item.draw(this.scale);
        })
    }

    update() {
        ctx.translate(this.camera.x, this.camera.y);
        
        this.draw_map();

        ctx.translate(-this.camera.x, -this.camera.y);
    }

    get decors() {
        return Maps.data[this.current_map].decors;
    }

    set decors(decors) {
        Maps.data[this.current_map].decors = decors;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = (scale > 1) ? scale : this.initial_scale;
        document.getElementById("zoom-text").innerHTML = this._scale;
        this.camera.speed = this._scale;
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