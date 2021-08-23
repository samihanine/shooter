class ImageManager {

    static data = {};
    static _nb_img_load = 0;

    constructor(settings) {
        settings = settings || {};

        this._src = settings.src;
        this._is_load = false;

        this._img = new Image();
        this._img.src = this._src;
        this._img.onload = () => {
            this.is_load = true;
            ImageManager.nb_img_load = ImageManager.nb_img_load+1;
        }

    }

    static get_image(src) {
        if (!src) return null;

        if (!ImageManager.data[src]) ImageManager.data[src] = new ImageManager({ src: src });

        return ImageManager.data[src];
    }

    static get nb_img() {
        return Object.keys(ImageManager.data).length;
    }

    static get nb_img_load() {
        return ImageManager._nb_img_load;
    }

    static set nb_img_load(nb_img_load) {

        ImageManager._nb_img_load = nb_img_load;

        if (ImageManager.nb_img_load == ImageManager.nb_img) {
            game.img_load = true;
        }
    }

    get is_load() {
        return this._is_load;
    }

    set is_load(is_load) {
        this._is_load = is_load
    }

    get is_load() {
        return this._is_load;
    }

    set is_load(is_load) {
        this._is_load = is_load
    }

    get img() {
        return this._img;
    }

    get src() {
        return this._src;
    }

    set src(src) {
        this._src = src;
    }

    draw({ context, x, y, w, h }) {
        if (this.is_load) context.drawImage(this.img,x,y,w,h);
        else console.error("Le jeu a été lancé avant que toutes les images ne soient chargées");
    }

}