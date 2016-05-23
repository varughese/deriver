$('body').append('<canvas width=\'400\' height=\'400\'></canvas');
var ctx = $('canvas')[0].getContext('2d');

function clear() {
    var saved = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = saved;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
}

function drawCircle(x, y, text) {
    var saved = ctx.fillStyle;
    var circle = new Path2D();
    circle.arc(x, y, 20, 0, 2*Math.PI);
    ctx.fill(circle);
    ctx.font="15px Arial";
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.fillStyle = saved;
}

function pickColor(val) {
    if(Object.keys(TreePattern.__OPS).indexOf(val) > -1) ctx.fillStyle = 'blue';
    else if(Object.keys(TreePattern.__FUNCTIONS).indexOf(val) > -1) ctx.fillStyle = 'red';
    else ctx.fillStyle = 'black';
}

function drawTree(t, x, y) {
    if(!x) x = 200;
    if(!y) y = 25;
    pickColor(t.val);
    drawCircle(x, y, t.val);
    if(t.left) drawTree(t.left, x-80, y+80);
    if(t.right) drawTree(t.right, x+80, y+80);
}
