class Pathfinding {

    static array = [];

    constructor(settings) {
        settings = settings || {};
        
        this.start = Object.assign({x: 0, y:0, distance: 0}, settings.start);
        this.end = Object.assign({x: 0, y:0, distance: 0}, settings.end);

        this.open_set = [];
        this.closed_set = [];
    }

    get array() {
        return Pathfinding.array;
    }

    main() {
        // on néttoie la matrice que l'on va utiliser
        this.array.map(item => { 
            return { x: item.x, y : item.y, distance: null, precedent: null }}
        );

        // on ajoute le point de départ à open_set
        this.open_set.push(this.start);

        let current = {};
        let loop = 0;
        while(this.open_set.length && loop < this.array.length) {
            // on définit le point courrant
            current = this.open_set.sort((a,b) => a.distance - b.distance)[0];

            // si le point courrant est le point d'arrivé, on stop la boucle
            if (current.x == this.end.x && current.y == this.end.y) {
                let result = [];

                while(current != null) {
                    result.push(current);
                    current = current.precedent;
                }

                return result;
                // return game.decors.filter(item => result.filter(item2 => item2.x == item.x && item2.y == item.y).length);
            }

            // on supprime le point courrant d'open_set et on l'ajoute à closed_set
            let index = this.open_set.indexOf(current);
            this.open_set.splice(index,1);
            this.closed_set.push(current);

            // on ajoute les voisins du point courrant à open_set
            let neighbor_a = this.array.find(item => this.check_neighbor(item,current.x+1,current.y));
            let neighbor_b = this.array.find(item => this.check_neighbor(item,current.x,current.y+1));
            let neighbor_c = this.array.find(item => this.check_neighbor(item,current.x-1,current.y));
            let neighbor_d = this.array.find(item => this.check_neighbor(item,current.x,current.y-1));

            if (neighbor_a) this.open_set.push(this.format_pos(neighbor_a,current));
            if (neighbor_b) this.open_set.push(this.format_pos(neighbor_b,current));
            if (neighbor_c) this.open_set.push(this.format_pos(neighbor_c,current));
            if (neighbor_d) this.open_set.push(this.format_pos(neighbor_d,current));

            loop++;
        }

        return [];
    }

    format_pos(obj,current) {
        obj.distance = Math.sqrt((this.end.x-obj.x)*(this.end.x-obj.x)+(this.end.y-obj.y)*(this.end.y-obj.y));
        obj.precedent = current;
        return obj;
    }

    check_neighbor(obj, x, y) {
        if (obj.x != x || obj.y != y) return false;
        if (this.closed_set.filter(item => item.x == x && item.y == y).length) return false;
        if (this.open_set.filter(item => item.x == x && item.y == y).length) return false;
        return true;
    }
}