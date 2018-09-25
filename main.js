w = 800
h = 600

var qt;
var colors = []
var visible = false;
var currColor = 1;

function setup() {
    createCanvas(w, h);

    var url_string = window.location.href
    var url = new URL(url_string);
    var d = url.searchParams.get("d");
    d = parseInt(d);
    if(isNaN(d))
        d = 7;

    qt = new Quadtree(new Rect(0, 0, w, h), d);

    colors[0] = '#888'
    colors[1] = '#ff0';
    colors[2] = '#0ff';
    colors[3] = '#f0f';
}

function draw() {
    background(255);

    var c = new Cir(mouseX, mouseY, 25);
    c.color = currColor;

    if (!visible)
        noStroke();

    if (mouseIsPressed) {
        qt.update(c);
    }

    qt.draw();

    noFill();
    stroke(color('#000'));
    c.draw();

}

function keyTyped() {
    if (key === 'a') {
        visible = !visible;
    } else if (parseInt(key) >= 0 && parseInt(key) < colors.length) {
        currColor = parseInt(key);
    }
}