var Storage = {};

Storage.get = function() {
    var arr = [];
    for(var x in sessionStorage) {
        arr.push(sessionStorage.getItem(x));
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
