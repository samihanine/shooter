class Camera {

    constructor(settings){
        settings = settings || {};
        this._x = 0; 
        this._y = 0;
        this._speed = settings.speed || 0;
        this._mode = settings.mode || "normal";
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

    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        const all_mode = ["creator", "normal"];
        
        this._mode = all_mode.find((item) => mode == item) ? mode : this._mode;
        game.scale = game.initial_scale;
        game.interface.change_mode();
    }

}