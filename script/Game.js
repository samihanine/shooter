class Game {

    constructor() {
        this.scale = 50;

        this.key = [];
        this.mouse = false;

        this.player = new Player(Entity.data.agent); 
        this.current_map = "village";
        this.camera = { 
            x: 50, 
            y: 0,
            mode: "creative"
        };
    }

    load(callback) {
        const json_files = ["bot", "player", "decor", "shape", "texture","maps"];
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
                    case "shape": new Shape(json[key]); break;
                    case "texture": new Texture(json[key]); break;
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
        document.addEventListener('keydown', (event) => {
            this.key[event.keyCode || event.which] = true;
            this.key_event();
        });
        document.addEventListener('keyup', (event) => {
            this.key[event.keyCode || event.which] = false;
            this.key_event();
        });

        document.onmousedown = (event) => {
            this.mouse = { clic: event.button, x: event.clientX, y: event.clientY };
            this.mouse_event()
        }
    }

    mouse_to_pos({ x, y }){
        return { 
            x: Math.floor(x/this.scale) - this.camera.x/this.scale, 
            y: Math.floor(y/this.scale) - this.camera.y/this.scale
        };
    }

    draw_map() {
        this.decors.forEach(item => {
            item.draw(this.scale);
        })
    }

    mouse_event() {
        switch(this.camera.mode) {
            case "creative":
                const pos = this.mouse_to_pos({x: this.mouse.x, y: this.mouse.y});

                const decor = new Decor(Decor.data["grass"]);
                decor.x = pos.x;
                decor.y = pos.y;
                this.decors.push(decor);
            break;
        }
    }

    key_event() {
        switch(this.camera.mode) {
            case "creative":
                if (this.key[39]) this.camera.x -= 5;
            break;
        }
    }

    update() {
        ctx.translate(this.camera.x, this.camera.y);
        
        this.draw_map();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.mouse = false;
    }

    get decors() {
        return Maps.data[this.current_map].decors;
    }

}