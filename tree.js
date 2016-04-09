function Tree(val) {
    this.val = val;
    this.$leftLevels = 1;
    this.$rightLevels = 1;
    this.left = false;
    this.right = false;
}

Tree.prototype.getDir = function(dir) {
    dir = "" + dir;
    if (parseInt(dir) >= 1 || dir.toLowerCase() === 'r' || dir.toLowerCase() === 'right') dir = 'right';
    else dir = 'left';

    return dir;
};


Tree.prototype.get = function(dir, n) {
    dir = this.getDir(dir);
    var current = this;
    for (var i = 1; i < n; i++) {
        current = current[dir];
    }
    return current;
};

Tree.prototype.set = function(dir, val) {
    if(!val) throw "Value must be defined";

    dir = this.getDir(dir);
    this['$' + dir + 'Levels']++;
    this[dir] = new Tree(val);
};

Tree.prototype.add = function(dir, val) {
    if(!val) throw "Value must be defined";

    dir = this.getDir(dir);

    var current = this;
    for (var i = 1; i < this['$' + dir + 'Levels']; i++) {
        current = current[dir];
        current['$' + dir + 'Levels']++;
    }
    this['$' + dir + 'Levels']++;
    current[dir] = new Tree(val);
};

Tree.prototype.r = function (v) {
    this.add(1, v);
};

Tree.prototype.l = function(v) {
    this.add(-1, v);
};

Tree.prototype.last = function(dir) {
    dir = this.getDir(dir);
    return this.get(dir, this['$' + dir + 'Levels']).val;
};

Tree.prototype.toString = function(num) {
    if(!num) num = 2;
    var left = Array(num+1).join(".") + this.left.toString(num+2),
        right = Array(num+1).join(".") + this.right.toString(num+2);
    if(!this.left) left = '';
    if(!this.right) right = '';
    return  '[' + this.val  + ']' + '\n' + left + right;
};



var x = new Tree('A');
x.add(1, 'B');
x.add(-1, 'LA');
x.get(-1, 2).set(-1, '2x');
x.get(-1, 2).set(1, '34');
x.add(1, 'C');
x.add(1, 'D');
console.log(x);
