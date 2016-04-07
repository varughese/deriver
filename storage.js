var Storage = {};

Storage.getFromStorage = function() {
    var arr = [];
    for(var x in sessionStorage) {
        arr.push(sessionStorage.getItem(x));
    }
    return arr;
};

Storage.addToStorage = function(val) {
    sessionStorage.setItem(Date.now(), val);
};
