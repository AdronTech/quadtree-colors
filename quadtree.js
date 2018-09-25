class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    intersects(other) {
        if (other instanceof Cir) {
            var DeltaX = other.x - max(this.x, min(other.x, this.x + this.w));
            var DeltaY = other.y - max(this.y, min(other.y, this.y + this.h));
            return (DeltaX * DeltaX + DeltaY * DeltaY) < (other.r * other.r);
        }

        console.log("Wrong Type");
        return false;
    }

    draw() {
        rect(this.x, this.y, this.w, this.h);
    }
}

class Cir {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(other) {
        if (other instanceof Rect) {
            var dx = max(this.x - other.x, other.x + other.w - this.x);
            var dy = max(this.y - other.y, other.y + other.h - this.y);
            return this.r * this.r >= dx * dx + dy * dy;
        }

        console.log("Wrong Type");
        return false;
    }


    draw() {
        ellipse(this.x, this.y, this.r * 2);
    }
}

class Quadtree {

    constructor(boundary, depth) {
        this.boundary = boundary;
        this.color = null;
        this.childs = [];
        this.depth = depth
    }

    subdivide() {
        if (this.childs.length != 0)
            return;

        var w2 = this.boundary.w / 2;
        var h2 = this.boundary.h / 2;

        this.childs[0] = new Quadtree(new Rect(this.boundary.x, this.boundary.y, w2, h2), this.depth)
        this.childs[1] = new Quadtree(new Rect(this.boundary.x + w2, this.boundary.y, w2, h2), this.depth)
        this.childs[2] = new Quadtree(new Rect(this.boundary.x, this.boundary.y + h2, w2, h2), this.depth)
        this.childs[3] = new Quadtree(new Rect(this.boundary.x + w2, this.boundary.y + h2, w2, h2), this.depth)

        this.childs.forEach(element => {
            element.color = this.color;
        });

        this.color = null;
    }

    update(c, d = 0) {

        if (!this.boundary.intersects(c))
            return;

        if (d >= this.depth || c.contains(this.boundary)) {
            this.color = c.color;
            this.childs = [];
            return;
        }

        this.subdivide();

        this.childs.forEach(element => {
            element.update(c, d + 1);
        });

        this.cleanUp();
    }

    cleanUp() {
        if (this.childs.length == 0)
            return;

        var col = this.childs[0].color;
        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].cleanUp();
            if (this.childs[i].childs.length != 0 || col !== this.childs[i].color) {
                return;
            }
        }

        this.color = col;
        this.childs = [];
    }

    draw() {

        this.childs.forEach(element => {
            element.draw();
        });

        if (this.color === null)
            noFill();
        else
            fill(color(colors[this.color]));

        this.boundary.draw();
    }

}