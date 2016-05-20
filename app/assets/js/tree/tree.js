function Tree(val) {
    this.val = !isNaN(val) ? Number(val) : val;
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

Tree.prototype.add = function(dir, val) {
    if(val !== 0 && !val) return;

    dir = this.getDir(dir);

    var current = this;

    while(current[dir]) {
        current = current[dir];
    }

    if(val instanceof Tree) {
        current[dir] = val;
    } else {
        current[dir] = new Tree(val);
    }
};

Tree.prototype.r = function (v) {
    this.add(1, v);
};

Tree.prototype.l = function(v) {
    this.add(-1, v);
};

Tree.prototype.equals = function(tree) {
    if(!tree || !TreePattern.eq(this.val, tree.val)) return false;
    var left, right; left = right = true;
    if(this.left && tree.left) {
        left = tree.left.equals(this.left);
    }
    if(this.right && tree.right) {
        right = tree.right.equals(this.right);
    }
    return left && right;
};

Tree.prototype.clone = function() {
    var clone = new Tree(this.val),
        left = this.left,
        right = this.right;

    if(left) {
        clone.left = left.clone();
    }
    if(right) {
        clone.right = right.clone();
    }

    return clone;
};

Tree.prototype.switch = function() {
    var temp = this.right;
    this.right = this.left;
    this.left = temp;
};

Tree.prototype.contains = function(target) {

    var left, right; left = right = false;
    if(target instanceof Tree && this.equals(target) ||
       TreePattern.eq(this.val, target)) return true;
    if(this.left) left = this.left.contains(target);
    if(this.right) right = this.right.contains(target);

    return left || right;
};

Tree.prototype.replace = function(target, replace) {
    if(TreePattern.eq(this.val, target)) {
        if(replace instanceof Tree) {
            this.val = replace.val;
            this.l(replace.left);
            this.r(replace.right);
            return;
        } else {
            this.val = replace;
        }
    }
    if(this.left) this.left.replace(target, replace);
    if(this.right) this.right.replace(target, replace);
};

Tree.prototype.toString = function(num) {
    if(!num) num = 2;
    var left = Array(num+1).join(".") + this.left.toString(num+2),
        right = Array(num+1).join(".") + this.right.toString(num+2);
    if(!this.left) left = '';
    if(!this.right) right = '';
    return  '[' + this.val  + ']' + '\n' + left + right;
};

Tree.prototype.toFlatString = function() {
    var left = this.left ? this.left.toFlatString() : '';
    var right = this.right ? this.right.toFlatString() : '';
    return  left + " " + this.val + " " + right;
};
