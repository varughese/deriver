
var Storage = {};

Storage.get = function() {
    var arr = [];
    for(var i=0; i<3; i++) {
        arr.push(sessionStorage.getItem(sessionStorage.key(sessionStorage.length-1-i)));
    }
    return arr;
};

Storage.add = function(val) {
    var timestamp = Date.now();
    sessionStorage.setItem(timestamp, val);
    return timestamp;
};

Storage.key = function(num){
    sessionStorage.key(num);
};

Storage.remove = function(key){
    sessionStorage.remove(key);
};
