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
        // we clean the matrix we are going to use
        this.array.map(item => { 
            return { x: item.x, y : item.y, distance: null, previous: null }
        });

        // we add the starting point to open_set
        this.open_set.push(this.format_neighbor(this.start,null));

        let current = {};
        let loop = 0;
        while (this.open_set.length && loop < this.array.length) {
            // we define the current point
            current = this.open_set.sort((a,b) => a.distance - b.distance)[0];

            // if the current point is the end point, we stop the loop
            if (current.x == this.end.x && current.y == this.end.y) {
                let result = [];
                
                while(current != null) {
                    result.push(current);
                    current = current.previous;
                }

                return result;
            }

            // we remove the current point from open_set and add it to closed_set
            let index = this.open_set.indexOf(current);
            this.open_set.splice(index,1);
            this.closed_set.push(current);

            // we add the neighbors of the current point to open_set
            let neighbor_a = this.array.find(item => this.check_neighbor(item,current.x+1,current.y));
            let neighbor_b = this.array.find(item => this.check_neighbor(item,current.x,current.y+1));
            let neighbor_c = this.array.find(item => this.check_neighbor(item,current.x-1,current.y));
            let neighbor_d = this.array.find(item => this.check_neighbor(item,current.x,current.y-1));

            if (neighbor_a) this.open_set.push(this.format_neighbor(neighbor_a,current));
            if (neighbor_b) this.open_set.push(this.format_neighbor(neighbor_b,current));
            if (neighbor_c) this.open_set.push(this.format_neighbor(neighbor_c,current));
            if (neighbor_d) this.open_set.push(this.format_neighbor(neighbor_d,current));

            loop++;
        }

        return [];
    }

    format_neighbor(obj,current) {
        obj.distance = Math.sqrt((this.end.x-obj.x)*(this.end.x-obj.x)+(this.end.y-obj.y)*(this.end.y-obj.y));
        obj.previous = current;
        return obj;
    }

    check_neighbor(obj, x, y) {
        if (obj.x != x || obj.y != y) return false;
        if (this.closed_set.filter(item => item.x == x && item.y == y).length) return false;
        if (this.open_set.filter(item => item.x == x && item.y == y).length) return false;
        return true;
    }
}