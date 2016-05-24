$('body').append('<canvas width=\'800\' height=\'800\'></canvas');
var canvas = $('canvas')[0],
    ctx = canvas.getContext('2d');

function clear() {
    var saved = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

function drawConnector(x, y, dir) {
    if(dir === 'left' || dir <= 0) dir = -1;
    else dir = 1;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    var change = dir * 20/Math.sqrt(2);
    var origin = [x+change,y+Math.abs(change)];
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(origin[0]+(dir*deltaX)-(dir*20), origin[1]+deltaY-Math.abs(change)-20);
    ctx.stroke();
}

var deltaX = 120;
var deltaY = 80;

function drawTree(t, x, y) {
    if(!x || !y) {
        x = canvas.width/2;
        y = 25;
        deltaX = 120;
        deltaY = 80;
        clear();
    }
    pickColor(t.val);
    drawCircle(x, y, t.val);
    deltaX/=0.26*Math.log(y);
    if(t.left) {
        drawTree(t.left, x-deltaX, y+deltaY);
        drawConnector(x, y, -1); }
    if(t.right) {
        drawTree(t.right, x+deltaX, y+deltaY);
        drawConnector(x, y, 1);
    }
    deltaX*=0.26*Math.log(y);
}

drawTree(derive("4sinx+arcsin(x^3)"))
