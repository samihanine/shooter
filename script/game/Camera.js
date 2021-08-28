class Camera {

    constructor(settings){
        settings = settings || {};
        this._x = settings.x || 0; 
        this._y = settings.y || 0;
        this._speed = settings.speed || 10;
        this._cursor = settings.cursor || null;
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

    get cursor() {
        return this._cursor;
    }

    set cursor(cursor) {
        const base = ['pointer', 'copy', 'crosshair', 'no-drop', 'grab']
        this._cursor = cursor;
        if (base.find(item => cursor == item)) document.body.style.cursor = `${cursor}`;
        else document.body.style.cursor = `url(${cursor}) 5 5, auto`;
    }

    update() {
        if (game.mode == "creative") {
            if (game.key[39] || game.key[68]) this.x = this.x - this.speed;
            else if (game.key[38] || game.key[87]) this.y = this.y + this.speed;
            else if (game.key[37] || game.key[65]) this.x = this.x + this.speed;
            else if (game.key[40] || game.key[83]) this.y = this.y - this.speed;
        }

        if (game.mode == "survival") {
            this.x = -game.player.x*game.scale;
            this.y = -game.player.y*game.scale;
        }
    }

}