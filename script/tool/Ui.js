class UserInterface {

    constructor() {
        this._tool = "";
        this._current = null;
        this._selected = null;
        this._selected_paint = false;
        
        this.tick = 250;
        this.time = Date.now();
    }

    get selected_paint() {
        return this._selected_paint;
    }

    set selected_paint(selected_paint) {
        this._selected_paint = selected_paint;
    } 

    get tool() {
        return this._tool;
    }

    set tool(tool) {
        this._tool = tool;

        if (game.mode === "creator") {
            if (this.tool === "insert") game.camera.cursor = 'copy';
            if (this.tool === "trash") game.camera.cursor = 'no-drop';
            if (this.tool === "select") game.camera.cursor = 'crosshair'; 
            if (this.tool === "paint") game.camera.cursor = 'grab';      
        }

        document.getElementById("insert-picker").className = (tool === "insert") ? "select" : "";
        document.getElementById("trash-picker").className = (tool === "trash") ? "select" : "";
        document.getElementById("select-picker").className = (tool === "select") ? "select" : "";

        this.selected_paint = false;
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

    update() {
        if (game.mode == "creative") this.creator_update();
    }

    creator_update() {

        if (Date.now() > this.time + this.tick) {
            this.save_map({dl: false});
            game.build_map();
            this.time = Date.now();
        }

        const s = game.decors.filter(item => item.select);
        if (s[0]) s[0].draw();

        if (game.mouse.clic != -1) {

            if (game.mouse.x < 200 || game.mouse.x > window.innerWidth - 200) return; 

            const pos = game.mouse_to_pos({x: game.mouse.x, y: game.mouse.y});
            console.log(pos.x)
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);

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

            if (this.tool === "paint") {
                if (!this.selected_paint) {
                    this.selected_paint = { x: pos.x, y: pos.y };
                } else {
                    let minx = this.selected_paint.x;
                    let miny = this.selected_paint.y;

                    for (let x=minx; x<=pos.x; x++) {
                        for (let y=miny; y<=pos.y; y++) {
                            game.decors = game.decors.filter(item => item.x != x || item.y != y);
                            if (this.current) {
                                const decor = new Decor(Object.assign(this.current, {x: x, y: y}));
                                game.decors.push(decor);
                            }
                        }
                    }

                    this.selected_paint = false;
                }
            }

        }
    }

    change_mode() {
        const creator_divs = document.getElementsByClassName("creator");
        const normal_divs = document.getElementsByClassName("normal");

        for(let i=0; i<creator_divs.length; i++){ creator_divs[i].style.display = "none"; }
        for(let i=0; i<normal_divs.length; i++){ normal_divs[i].style.display = "none"; }

        if (game.mode == "survival") {
            for(let i=0; i<normal_divs.length; i++){ normal_divs[i].style.display = "flex"; }
        }

        if (game.mode == "creative") {
            for(let i=0; i<creator_divs.length; i++){ creator_divs[i].style.display = "flex"; }
        }

        this.tool = this.tool;
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

        document.getElementById("paint-picker").onclick = () => {
            this.tool = "paint";
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
            game.mode = "normal";
        };
    }

    save_map({ dl }) {
        let json = "[";

        game.decors.forEach(item => {
            json += JSON.stringify({ x: item.x, y: item.y, src: item.src, collision_type: item.collision_type, rotate: item.rotate }) + ",";
        });
        json = json.slice(0, -1)
        json += "]";

        if (dl) {
            this.dl_json(json,"save");
            this.dl_canvas(game.background_canvas,"save");
        }
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

    update_life(percentage) {
        percentage = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
        document.getElementById("player-life").style.width = `${percentage}%`;
    }

    update_coins(number) {
        number = number < 0 ? 0 : number;
        
        document.getElementById("player-coins").innerHTML = number;
    }

    update_bullets({ bullets, chargers, chargers_size }) {
        const main = document.getElementsByClassName("normal__gun__bullets")[0];
        main.innerHTML = "";
        main.style.display = "none";

        for(let i=1; i<=chargers; i++) {
            const container = document.createElement("div");
            container.className = "normal__gun__bullets__container";
    
            const img = document.createElement("img");
            img.src = "https://img.icons8.com/fluency/480/ffffff/bullet-2.png";
            img.alt = `bullet icon`;
    
            const text = document.createElement("p");
            text.innerHTML = (i == 1) ? bullets : chargers_size;
    
            container.appendChild(img);
            container.appendChild(text);
            
            main.appendChild(container);
        }

        main.style.display = "flex";

    }

    update_gun(obj) {
        const img = document.getElementsByClassName("normal__gun__current")[0].firstChild;
        img.src = obj ? obj.src : "https://lh3.googleusercontent.com/proxy/mEnrCPL0k7m-23vCyg5DO9L5L7ahE4menmQmaWaWWNzuwBJgSodYrBscrPA-KAg3m1AJOIe2oHgxjyNXMyzDPJgfuL-QrpBzDLAO9xzT";
    }

    dl_json(json, name){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
        let link = document.createElement('a');
        link.setAttribute("href", dataStr);
        link.setAttribute("download", name + ".json");
        document.body.appendChild(link); // required for firefox
        link.click();
        link.remove();
    }

    dl_canvas(canvas,name) {
        var link = document.createElement('a');
        link.download = name + '.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link); // required for firefox
        link.click();
        link.remove();
    }

}