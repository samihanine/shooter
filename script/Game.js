class Game {

    constructor() {
        this.scale = 50;

        this.key;
        this.mouse;

        this.player = new Player(Entity.data.agent); 
        this.current_map = "village";
        this.camera = { 
            x: 50, 
            y: 0,
            speed: 10,
            mode: "creative",
        };

        this.creative;
    }

    load(callback) {
        const json_files = ["bot", "player", "decor", "sprite","maps"];
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
                    case "sprite": new Sprite(json[key]); break;
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
            this.mouse_event();
        }

        document.onkeydown = (event) => {
            this.key = event.key;
            this.key_event();
        }

        this.creative = new Creative();
        this.creative.ini();
    }

    mouse_to_pos({ x, y }){
        return { 
            x: Math.round(Math.floor(x/this.scale) - Math.round(this.camera.x/this.scale)), 
            y: Math.round(Math.floor(y/this.scale) - Math.round(this.camera.y/this.scale))
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
                this.creative.mouse_event();
            break;
        }
    }

    key_event() {
        switch(this.camera.mode) {
            case "creative":
                if (this.key === "ArrowRight") this.camera.x -= this.camera.speed;
                if (this.key === "ArrowUp") this.camera.y += this.camera.speed;
                if (this.key === "ArrowLeft") this.camera.x += this.camera.speed;
                if (this.key === "ArrowDown") this.camera.y -= this.camera.speed;
            break;
        }
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

}