/*
 *  Storage.js  Managing local storage for a specific extension
 */

'use strict';

C.Extension.Storage = C.Utils.Inherit(function (base, options) {

    if (!options) { throw 'Missing parameters'; }

    base();

    this._package_name = options.package_name;

}, EventEmitter, 'C.Extension.Storage');

C.Extension.Storage.prototype.get = function (key) {

    var internal_key = this._package_name + '-' + key;
    return localStorage.getItem(internal_key);
};

C.Extension.Storage.prototype.set = function (key, value) {

    var internal_key = this._package_name + '-' + key;
    return localStorage.setItem(internal_key, value);
};
