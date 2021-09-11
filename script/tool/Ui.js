class UserInterface {

    constructor() {
        this.build_ui();
        this.add_listenners();
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

        game.creative.tool = game.creative.tool;
    }

    add_listenners() {
        document.getElementById("insert-picker").onclick = () => {
            game.creative.tool = "insert";
        }

        document.getElementById("select-picker").onclick = () => {
            game.creative.tool = "select";
        }

        document.getElementById("trash-picker").onclick = () => {
            game.creative.tool = "trash";
        }

        document.getElementById("paint-picker").onclick = () => {
            game.creative.tool = "paint";
        }

        document.getElementById("rotate").onclick = () => {
            if (game.creative.selected) {
                game.creative.selected.rotate = game.creative.selected.rotate + 90;
                game.creative.current.rotate = game.creative.current.rotate + 90;
            }
        }

        document.getElementById("collision-type").onchange = (e) => {
            if (game.creative.selected) {
                game.creative.selected.collision_type = e.target.value;
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
            game.creative.save_map({dl: true})
        };

        document.getElementById("close").onclick = () => {
            game.mode = "normal";
        };
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

            if (!game.creative.current) { 
                game.creative.current = obj[key];
            }

            const img = document.createElement("img");
            img.src = obj[key].src;
            img.alt = `${key} icon`;
    
            const text = document.createElement("p");
            text.innerHTML = key;
    
            containter.appendChild(img);
            containter.appendChild(text);

            containter.onclick = () => {
                game.creative.current = obj[key];
                game.creative.tool = "insert";
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

    update_bullets(obj) {
        obj = obj || {};
        const bullets = obj.bullets || 0;
        const chargers = obj.chargers || 0;
        const chargers_size = obj.chargers_size || 0;

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

}