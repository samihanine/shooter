class Creative {

    constructor() {
        this._sprite = false;
        this._tool = "insert";
        this._decor = null;

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

    get sprite() {
        return this._sprite;
    }

    set sprite(sprite) {
        this._sprite = sprite;
    }

    get decor() {
        return this._decor;
    }

    set decor(decor) {
        if (this.decor) this.decor.select = false;
        if (decor) decor.select = true;
        this._decor = decor;

        if (this._decor) this.collision.checked = this._decor.collision;
    }

    ini() {
        this.tool = "insert";

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
            if (this.decor) this.decor.rotate = this.decor.rotate + 90;
        }

        this.collision.onchange = () => {
            if (this.decor) this.decor.collision = this.collision.checked;
        }
       
        this.build_ui();
    }

    build_ui() {
        const main = document.getElementsByClassName("creative__picker")[0];

        for (const key in Sprite.data) {
            const containter = document.createElement("containter");
            containter.className = "container";

            if (!this.sprite) { 
                this.sprite = key;
                this.insert.src = Sprite.data[key].src;
            }

            const img = document.createElement("img");
            img.src = Sprite.data[key].src;
            img.alt = `${key} icon`;
    
            const text = document.createElement("p");
            text.innerHTML = key;
    
            containter.appendChild(img);
            containter.appendChild(text);

            containter.onclick = () => {
                this.sprite = key;
                this.insert.src = Sprite.data[key].src;
                this.tool = "insert";
            }

            main.appendChild(containter);
        }
    }

    mouse_event() {
        if (game.mouse.x < 200 || game.mouse.x > window.innerWidth - 200) return; 
        const pos = game.mouse_to_pos({x: game.mouse.x, y: game.mouse.y});

        if (this.tool === "insert") {
            if (!Sprite.data[this.sprite].small) game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);
            const decor = new Decor();
            decor.sprite = this.sprite;
            decor.x = pos.x;
            decor.y = pos.y;
            game.decors.push(decor);
            console.log(game.decors)
            this.decor = decor;
        }

        if (this.tool === "select") {
            const tab = game.decors.filter(item => item.x == pos.x && item.y == pos.y).reverse();
            if (tab.length) {
                const obj = tab[0];
                this.decor = obj;
            } else {
                this.decor = null; 
            }
        }

        if (this.tool === "trash") {
            game.decors = game.decors.filter(item => item.x != pos.x || item.y != pos.y);
        }
    }

}