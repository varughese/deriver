String.prototype.splice = function(start, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start);
};

String.prototype.cut = function (start, end) {
    return this.substring(0, start) + this.substring(end);
};

String.prototype.replaceAt=function(index, char){
    return this.substring(0,index) + char + this.substring(index+char.length);
};

String.prototype.findChar = function(token) {
    var indices = [];
    for(var i=0; i<this.length; i++)
     if(this.substring(i, i+token.length) === token) indices.push(i);

    return indices;
};

String.prototype.removeSpaces = function() {
    return this.trim().replace(/\s+/g, '');
};

Number.prototype.isBetween = function(a, b) {
    return this<=b && this>=a;
};
