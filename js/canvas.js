$('body').append('<canvas id=\'canvas\' width=\'870\' height=\'800\'></canvas');
$('body').append('<div class=\'theme-picker col-sm-5\'></div>');

var canvas = $('canvas')[0],
    ctx = canvas.getContext('2d'),
    deltaX,
    deltaY;

var THEME = {
    bg: 'white',
    circle: {
        radius: '14',
        stroke: 'black',
        op: 'firebrick',
        fx: '#8C00C3',
        x: '#557CD6',
        num: '#676767'
    },
    branches: 'black',
    font: {
        color:'white',
        style: '15px Arial'
    },
    deltaX: 120,
    deltaY: 80
};

for(var key in THEME) {
    if(typeof THEME[key] === 'object'){
        $('.theme-picker').append('<div class=\'sub-theme-picker form-group\'><h4>'+key+'</h4></div>');
        for(var subKey in THEME[key])
            $(".sub-theme-picker").last().append("<label>"+subKey+"<div class=\"form-group\"></label><input class=\"form-control\" id=\"" + key +" "+ subKey + "\" /></div>");
    }
    $(".theme-picker").append("<div class=\"form-group\"><label>"+key+"</label><input class=\"form-control\" id=\"" + key + "\" /></div>");
}
$(".theme-picker").change(function(e) {
    var ids = $(e.target).attr('id');
    var vjawn = $(e.target).val();
    var j = ids.split(" ");
    var theme = {};
    if(j.length>1) {
        theme[j[0]] = {};
        theme[j[0]][j[1]] = vjawn;
    } else {
        theme[j] = vjawn;
    }
    setTheme(theme);
    drawTree((val || derive("4sinx+arcsin(x^3)")));
});

function setTheme(theme) {
    for(var key in THEME) {
        if(theme[key] && typeof THEME[key] === 'object')
            for(var subKey in THEME[key])
                THEME[key][subKey] = theme[key][subKey] || THEME[key][subKey];
        else
            THEME[key] = theme[key] || THEME[key];
    }
}

function clear() {
    var saved = ctx.fillStyle;
    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = saved;
}

function drawCircle(x, y, text) {
    ctx.lineWidth=2;
    var saved = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, THEME.circle.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = THEME.circle.stroke;
    ctx.stroke();
    ctx.closePath();
    ctx.font= THEME.font.style;
    ctx.fillStyle = THEME.font.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.fillStyle = saved;
}

function pickColor(val) {
    if(Object.keys(TreePattern.__OPS).indexOf(val) > -1) ctx.fillStyle = THEME.circle.op;
    else if(Object.keys(TreePattern.__FUNCTIONS).indexOf(val) > -1) ctx.fillStyle = THEME.circle.fx;
    else if(val === 'x') ctx.fillStyle = THEME.circle.x;
    else ctx.fillStyle = THEME.circle.num;
}

function drawConnector(x, y, dir) {
    if(dir === 'left' || dir <= 0) dir = -1;
    else dir = 1;
    ctx.beginPath();
    ctx.strokeStyle = THEME.branches;
    // ctx.fillStyle = 'black';
    // ctx.beginPath();
    // var change = dir * 20/Math.sqrt(2);
    // var origin = [x+change,y+Math.abs(change)];
    // ctx.moveTo(origin[0], origin[1]);
    // ctx.lineTo(origin[0]+(dir*deltaX)-(dir*20), origin[1]+deltaY-Math.abs(change)-20);
    // ctx.stroke();

    // ctx.moveTo(x, y+20);
    // ctx.lineTo(x+(dir * deltaX), y+deltaY-20);
    // ctx.lineWidth=2;
    // ctx.stroke();

    ctx.moveTo(x, y);
    ctx.lineTo(x+(dir * deltaX), y+deltaY);
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.closePath();
}



function drawTree(t, x, y) {
    if(!x || !y) {
        x = canvas.width/2;
        y = 25;
        deltaX = THEME.deltaX;
        deltaY = THEME.deltaY;
        clear();
    }
    deltaX/=0.26*Math.log(y);
    if(t.left) {
        drawConnector(x, y, -1);
        drawTree(t.left, x-deltaX, y+deltaY);
    }
    if(t.right) {
        drawConnector(x, y, 1);
        drawTree(t.right, x+deltaX, y+deltaY);
    }
    pickColor(t.val);
    drawCircle(x, y, t.val);
    deltaX*=0.26*Math.log(y);
}

drawTree(derive("4sinx+arcsin(x^3)"));
