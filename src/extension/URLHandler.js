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
    this._decoder = new TextDecoder();

    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', this._url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if (this.status == 200) {
            self._content = new Uint8Array(xhr.response);
            callback();
        } else {
            callback(true);
        }
    };

    xhr.send();
};

fileHandle.prototype.asUint8Array = function () {
    return this._content;
};

fileHandle.prototype.asText = function () {
    return this._decoder.decode(this._content)
};
