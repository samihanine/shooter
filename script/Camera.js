class Camera {

    constructor(settings){
        settings = settings || {};
        this._x = settings.x || 0; 
        this._y = settings.y || 0;
        this._mode = settings.mode || "normal";
        this._speed = settings.speed || 10;
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
        
        this._mode = all_mode.find((item) => mode == item) ? mode : this._mode;
        game.scale = game.initial_scale;
        game.ui.change_mode();

        if (mode === "normal") game.player.update_camera();
    }

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

}