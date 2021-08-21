class Camera {

    constructor(settings){
        settings = settings || {};
        this._x = settings.x || 0; 
        this._y = settings.y || 0;
        this._mode = settings.mode || "normal";
        this._speed = settings.speed || 10;
        this._curosr = settings.curosr || null;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._y = y;
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        const all_mode = ["creator", "normal"];
        
        if (mode === "normal") {
            game.player.update_camera();
            this.cursor = "https://img.icons8.com/ios-glyphs/20/000000/define-location.png";
        } else {
            this.cursor = "";
        }

        this._mode = all_mode.find((item) => mode == item) ? mode : this._mode;
        game.scale = game.initial_scale;
        game.ui.change_mode();
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    get cursor() {
        return this._cursor;
    }

    set cursor(cursor) {
        const base = ['pointer', 'copy', 'crosshair', 'no-drop']
        this._cursor = cursor;
        if (base.find(item => cursor == item)) document.body.style.cursor = `${cursor}`;
        else document.body.style.cursor = `url(${cursor}), auto`;
    }

    ini(){
        this.mode = "normal";
    }

}