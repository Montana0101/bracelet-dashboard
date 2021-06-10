function HashMap() {
    var length = 0;
    var obj = new Object();
    this.isEmpty = function () {
        return length == 0;
    };
    this.containsKey = function (key) {
        return (key) ? (key in obj) : false;
    };
    this.containsValue = function (value) {
        for (key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };
    this.get = function (key) {
        return (this.containsKey(key)) ? obj[key] : null;
    };
    this.remove = function (key) {
        if (this.containsKey(key) && delete obj[key]) {
            length--;
        }
    };
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };
    this.values = function () {
        var _values = new Array();
        for (key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };
    this.keySet = function () {
        var ks = new Array();
        for (key in obj) {
            ks.push(key);
        }
        return ks;
    };
    this.size = function () {
        return this.length;
    };
    this.clear = function () {
        this.length = 0;
        this.obj = new Object();
    };
    this.toJSON = function () {
        return JSON.stringify(obj, null, 2);
    }

};