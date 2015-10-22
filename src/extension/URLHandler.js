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
    if ('TextDecoder' in window) {
        this._decoder = new TextDecoder();
    } else {
        this._decoder = {
            decode: function ab2str(buf) {
                if (buf.byteLength == 0) return ""
                var bufView = new Uint8Array(buf);
                if (bufView[0]==0) return "";
                var unis = [];
                var step = 32768;
                var str = "";
                unis.push(bufView[0]);
                for (var i = 1; i < bufView.length; i++) {
                    if (bufView[i] == 0) break;
                    unis.push(bufView[i]);
                    if (i % step == 0) {
                        str += String.fromCharCode.apply(null, unis);
                        unis = [];
                    }
                }
                str += String.fromCharCode.apply(null, unis);
                return str;
            }
        };
    }


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
