/*
 *  URLHandler //TODO description
 */

var URLHandler = function (options) {

    this._base = options.baseUrl;

    this._fileHandles = {};

};

URLHandler.prototype.file = function (path, callback) {
    if (path in this._fileHandles) {
        var handle = this._fileHandles[path];
        if (handle._content) {
            return callback(null, handle);
        } else {
            return callback(true);
        }
    } else {
        var self = this;
        var handle = new fileHandle(this._base + '/' + path, function (err) {
            if (err) {
                return callback(err);
            }
            self._fileHandles[path] = handle;
            callback(null, handle);
        });
    }
};

var fileHandle = function (url, callback) {

    this._url = url;
    this._content = null;

    var self = this;
    $.get(this._url, function (data, status) {
        if (status != "success") {
            return callback(true);
        }
        self._content = data;
        callback(null);
    }, "text").fail(function () {
        callback(null);
    });
};

fileHandle.prototype.asText = function () {

    return this._content;

};
