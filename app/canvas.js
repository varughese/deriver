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
    circle.arc(x, y, 25, 0, 2*Math.PI);
    ctx.fill(circle);
    ctx.font="15px Arial";
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.fillStyle = saved;
}
