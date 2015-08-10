/*
 *  URLHandler //TODO description
 */

var URLHandler = function (options) {

    this._base = options.baseUrl;

    this._fileHandles = {};

};

URLHandler.prototype.file = function (path) {

    var handle;
    if (path in this._fileHandles) {
        handle = this._fileHandles[path];
    } else {
        handle = this._fileHandles[path] = new fileHandle(this._base + '/' + path);
    }
    if (handle._content != undefined) {
        return handle;
    }
    return undefined;
};

var fileHandle = function (url) {

    this._url = url;
    this._content = $.ajax({
        type: "GET",
        url: this._url,
        async: false
    }).responseText;
};

fileHandle.prototype.asText = function () {

    return this._content;

};
