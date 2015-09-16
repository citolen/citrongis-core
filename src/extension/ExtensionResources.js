/*
 *  C.Extension.ExtensionResources  //TODO description
 */

'use strict';

C.Extension.ExtensionResources = function (handler, callback) {
    this._handler = handler;
    var self = this;
    this.checkHandler(function (err) {
        if (err) { return callback(true, self); }
        return callback(null, self);
    });
};

C.Extension.ExtensionResources.prototype.checkHandler = function (callback) {
    if (!this._handler) { return callback(true); }
    this.file(C.Extension.AR_PACKAGE, function (err, handle) {
        if (err) { return callback(err); }
        callback(null);
    });
};

C.Extension.ExtensionResources.prototype.file = function (path, callback) {
    if (this._handler instanceof URLHandler) {
        this._handler.file(path, callback);
    } else { //JSZip
        callback(null, this._handler.file(path));
    }
};
