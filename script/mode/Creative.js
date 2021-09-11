class Creative {

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
        if (Date.now() > this.time + this.tick) {
            this.save_map({
                dl: false
            });
            game.build_map();
            this.time = Date.now();
        }

        const s = game.decors.filter(item => item.select);
        if (s[0]) s[0].draw();

        // mouse event
        if (!(game.mouse.clic != -1) || game.mouse.x < 200 + game.area.left || game.mouse.x > window.innerWidth - (200 + game.area.left)) return;

        const pos = game.mouse_to_pos({
            x: game.mouse.x,
            y: game.mouse.y
        });
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);

        switch(this.tool) {
            case "insert": 
                if (!this.current) return
                if (!this.current.stack) game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);

                const decor = new Decor(Object.assign(this.current, {
                    x: pos.x,
                    y: pos.y
                }));
                this.selected = decor;
            break;
            case "select":
                const tab = game.decors.filter(item => item.x == pos.x && item.y == pos.y).reverse();
                if (tab.length) {
                    this.selected = tab[0];
                } else {
                    this.selected = null;
                }
            break;
            case "trash":
                let int = false;
                game.decors.forEach((item, index) => {
                    if (item.x == pos.x && item.y == pos.y) int = index;
                })
                if (int) game.decors.splice(int, 1);
            break;
            case "pain":
                if (!this.selected_paint) {
                    this.selected_paint = {
                        x: pos.x,
                        y: pos.y
                    };
                } else {
                    let minx = this.selected_paint.x;
                    let miny = this.selected_paint.y;
    
                    for (let x = minx; x <= pos.x; x++) {
                        for (let y = miny; y <= pos.y; y++) {
                            game.decors = game.decors.filter(item => item.x != x || item.y != y);
                            if (this.current) {
                                new Decor(Object.assign(this.current, {
                                    x: x,
                                    y: y
                                }));
                            }
                        }
                    }
    
                    this.selected_paint = false;
                }
            break;
        }
    }

    save_map({ dl }) {
        let json = "[";

        game.decors.forEach(item => {
            json += JSON.stringify({
                x: item.x,
                y: item.y,
                src: item.src,
                collision_type: item.collision_type,
                rotate: item.rotate
            }) + ","; 
        });
        json = json.slice(0, -1)
        json += "]";

        if (dl) {
            this.dl_json(json, "save");
            this.dl_canvas(game.background_canvas, "save");
        } else window.localStorage.setItem("world", json);
    }

    dl_json(json, name) {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
        let link = document.createElement('a');
        link.setAttribute("href", dataStr);
        link.setAttribute("download", name + ".json");
        document.body.appendChild(link); // required for firefox
        link.click();
        link.remove();
    }

    dl_canvas(canvas, name) {
        var link = document.createElement('a');
        link.download = name + '.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link); // required for firefox
        link.click();
        link.remove();
    }

}