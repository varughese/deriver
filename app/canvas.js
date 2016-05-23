$('body').append('<canvas width=\'400\' height=\'400\'></canvas');
var ctx = $('canvas')[0].getContext('2d');
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
}
draw();
