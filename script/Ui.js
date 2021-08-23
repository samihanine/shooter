class UserInterface {

    constructor() {
        this._tool = "";
        this._current = null;
        this._selected = null;
    }

    get tool() {
        return this._tool;
    }

    set tool(tool) {
        this._tool = tool;

        if (game.camera.mode === "creator") {
            if (this.tool === "insert") game.camera.cursor = 'copy';
            if (this.tool === "trash") game.camera.cursor = 'no-drop';
            if (this.tool === "select") game.camera.cursor = 'crosshair';            
        }

        document.getElementById("insert-picker").className = (tool === "insert") ? "select" : "";
        document.getElementById("trash-picker").className = (tool === "trash") ? "select" : "";
        document.getElementById("select-picker").className = (tool === "select") ? "select" : "";
    }

    get current() {
        return this._current;
    }

    set current(current) {
        this._current = current;

        if (this._current) {
            document.getElementById("insert-picker").src = this._current.src;
        }
    }

    get selected() {
        return this._selected;
    }

    set selected(selected) {
        if (this._selected) this._selected.select = false;
        this._selected = selected;
        
        if (selected) {
            selected.select = true;
            document.getElementById("collision-type").value = this._selected.collision_type;
            document.getElementsByClassName("creator__settings")[0].style.display = "flex";
        } else {
            document.getElementsByClassName("creator__settings")[0].style.display = "none";
        }
    }

    ini() {
        this.tool = "select";
       
        this.build_ui();
        this.add_listenners();
    }

    add_listenners() {
        document.getElementById("insert-picker").onclick = () => {
            this.tool = "insert";
        }

        document.getElementById("select-picker").onclick = () => {
            this.tool = "select";
        }

        document.getElementById("trash-picker").onclick = () => {
            this.tool = "trash";
        }

        document.getElementById("rotate").onclick = () => {
            if (this.selected) {
                this.selected.rotate = this.selected.rotate + 90;
                this.current.rotate = this.current.rotate + 90;
            }
        }

        document.getElementById("collision-type").onchange = (e) => {
            if (this.selected) {
                this.selected.collision_type = e.target.value;
            }
        }
        
        document.getElementById("current-tag").onchange = e => {

            let all = document.getElementsByClassName("container");
            for(let i=0; i<all.length; i++) {
                all[i].style.display = "none";
            }

            if (e.target.value == 0) {                
                let tab = document.getElementsByClassName("container");
                for(let i=0; i<tab.length; i++) {
                    tab[i].style.display = "flex";
                }
            } else {
                let tab = document.getElementsByClassName(`tag_${e.target.value}`);
                for(let i=0; i<tab.length; i++) {
                    tab[i].style.display = "flex";
                }
            }
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
            this.save_map({dl: true})
        };

        document.getElementById("close").onclick = () => {
            game.camera.mode = "normal";
        };
    }

    save_map({ dl }) {
        let json = "[";

        game.decors.forEach(item => {
            json += JSON.stringify({ x: item.x, y: item.y, src: item.src, collision_type: item.collision_type, rotate: item.rotate }) + ",";
        });
        json = json.slice(0, -1)
        json += "]";

        if (dl) dl_json(json,"test");
        else window.localStorage.setItem("world",json);
    }

    build_ui() {
        const main = document.getElementsByClassName("creator__picker")[0];

        // sort the properties of the object in alphabetical order
        const obj = Object.keys(Decor.data).sort().reduce((obj, key) => { 
              obj[key] = Decor.data[key]; 
              return obj;
            },{}
        );

        for (const key in obj) {
            const containter = document.createElement("containter");
            containter.className = `container`;
            obj[key].tag.forEach(item => containter.className += ` tag_${item}`);

            if (!this.current) { 
                this.current = obj[key];
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
                pos.x = Math.floor(pos.x);
                pos.y = Math.floor(pos.y);

                if (pos.x < 0 || pos.y < 0) {
                    alert('The selected coordinate is negative');
                    return;
                }

                if (this.tool === "insert") {
                    if (!this.current) return
                    if (!this.current.stack) game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);
                    
                    const decor = new Decor(Object.assign(this.current, {x: pos.x, y: pos.y}));
                    game.decors.push(decor);
                    this.selected = decor;
                }
        
                if (this.tool === "select") {
                    const tab = game.decors.filter(item => item.x == pos.x && item.y == pos.y).reverse();
                    if (tab.length) {
                        const obj = tab[0];
                        this.selected = obj;
                    } else {
                        this.selected = null; 
                    }
                }
        
                if (this.tool === "trash") {
                    let int = false;
                    game.decors.forEach((item,index)=>{
                        if (item.x == pos.x && item.y == pos.y) int = index;
                    })
                    if (int) game.decors.splice(int,1);
                }
            break;
        }


    }

    key_event() {
        switch (game.camera.mode) {
            case "creator":
                if (game.key[39] || game.key[68]) game.camera.x = game.camera.x - game.camera.speed;
                else if (game.key[38] || game.key[87]) game.camera.y = game.camera.y + game.camera.speed;
                else if (game.key[37] || game.key[65]) game.camera.x = game.camera.x + game.camera.speed;
                else if (game.key[40] || game.key[83]) game.camera.y = game.camera.y - game.camera.speed;

                this.save_map({dl: false});
                game.build_map();
            break;
        }
    }

    update() {
        this.key_event();
    }

    change_mode() {
        const creator_divs = document.getElementsByClassName("creator");
        const normal_divs = document.getElementsByClassName("normal");

        for(let i=0; i<creator_divs.length; i++){ creator_divs[i].style.display = "none"; }
        for(let i=0; i<normal_divs.length; i++){ normal_divs[i].style.display = "none"; }

        if (game.camera.mode == "normal") {
            for(let i=0; i<normal_divs.length; i++){ normal_divs[i].style.display = "flex"; }
        }

        if (game.camera.mode == "creator") {
            for(let i=0; i<creator_divs.length; i++){ creator_divs[i].style.display = "flex"; }
        }

        this.tool = this.tool;
    }

}

function dl_json(json, name){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", name + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}