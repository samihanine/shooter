class Interface {

    constructor() {
        this._tool = "insert";
        this._current = null;

        this.insert = document.getElementById("insert-picker");
        this.select = document.getElementById("select-picker");
        this.trash = document.getElementById("trash-picker");

        this.rotate = document.getElementById("rotate");
        this.collision = document.getElementById("collision");
    }

    get tool() {
        return this._tool;
    }

    set tool(tool) {
        this._tool = tool;

        this.insert.className = (tool === "insert") ? "select" : "";
        this.trash.className = (tool === "trash") ? "select" : "";
        this.select.className = (tool === "select") ? "select" : "";
    }

    get current() {
        return this._current;
    }

    set current(current) {
        if (this.current) this.current.select = false;
        if (current) current.select = true;
        this._current = current;

        if (this._current) this.collision.checked = this._current.collision;
    }

    ini() {
        this.tool = "insert";
       
        this.build_ui();
        this.add_listenners();
    }

    add_listenners() {
        this.insert.onclick = () => {
            this.tool = "insert";
        }

        this.select.onclick = () => {
            this.tool = "select";
        }

        this.trash.onclick = () => {
            this.tool = "trash";
        }

        this.rotate.onclick = () => {
            if (this.current) this.current.rotate = this.current.rotate + 90;
        }

        this.collision.onchange = () => {
            if (this.current) this.current.collision = this.collision.checked;
        }

        document.getElementById("zoom-out").onclick = () => {
            game.scale = game.scale - 10;
        };

        document.getElementById("zoom-in").onclick = () => {
            game.scale = game.scale + 10;
        };

        document.getElementById("zoom-text").onclick = () => {
            game.scale = game.initial_scale;
        }

        document.getElementById("save").onclick = () => {
            let json = "[";

            game.decors.forEach(item => {
                json += JSON.stringify({ x: item.x, y: item.y, src: item.src, collision: item.collision, rotate: item.rotate }) + ",";
            });
            json = json.slice(0, -1)
            json += "]";

            dl_json(json,"test");
        };

        document.getElementById("close").onclick = () => {
            game.camera.mode = "normal";
        };
    }

    build_ui() {
        const main = document.getElementsByClassName("creator__picker")[0];

        const obj = Object.keys(Decor.data).sort().reduce(
            (obj, key) => { 
              obj[key] = Decor.data[key]; 
              return obj;
            },{}
        );
        for (const key in obj) {
            const containter = document.createElement("containter");
            containter.className = "container";

            if (!this.current) { 
                this.current = obj[key];
                this.insert.src = obj[key].src;
            }

            const img = document.createElement("img");
            img.src = obj[key].src;
            img.alt = `${key} icon`;
    
            const text = document.createElement("p");
            text.innerHTML = key;
    
            containter.appendChild(img);
            containter.appendChild(text);

            containter.onclick = () => {
                this.current = obj[key];
                this.insert.src = obj[key].src;
                this.tool = "insert";
            }

            main.appendChild(containter);
        }
    }

    mouse_event(mode) {
        switch (mode) {
            case "creator":
                if (game.mouse.x < 200 || game.mouse.x > window.innerWidth - 200) return; 
                const pos = game.mouse_to_pos({x: game.mouse.x, y: game.mouse.y});
        
                if (this.tool === "insert") {
                    if (!this.current.small) game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);
                    const decor = new Decor(this.current);
                    decor.x = pos.x;
                    decor.y = pos.y;
                    game.decors.push(decor);
                    this.current = decor;
                }
        
                if (this.tool === "select") {
                    const tab = game.decors.filter(item => item.x == pos.x && item.y == pos.y).reverse();
                    if (tab.length) {
                        const obj = tab[0];
                        this.current = obj;
                    } else {
                        this.current = null; 
                    }
                }
        
                if (this.tool === "trash") {
                    game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);
                }
            break;
        }
    }

    key_event(mode) {
        switch (mode) {
            case "creator":
                if (game.key === "ArrowRight") game.camera.x = game.camera.x - game.camera.speed;
                if (game.key === "ArrowUp") game.camera.y = game.camera.y + game.camera.speed;
                if (game.key === "ArrowLeft") game.camera.x = game.camera.x + game.camera.speed;
                if (game.key === "ArrowDown") game.camera.y = game.camera.y - game.camera.speed;
            break;
        }
    }

    change_mode() {
        const creator_divs = document.getElementsByClassName("creator");
        console.log(creator_divs)
        for(let i=0; i<creator_divs.length; i++){
            creator_divs[i].style.display = "none";
        }

        if (game.camera.mode == "creator") {

        }
    }

}

function dl_json(json, name){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", name + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}