/*
 *  Storage.js  Managing local storage for a specific extension
 */

'use strict';

/**
 * Store data on client side
 *
 * @class Storage
 * @namespace E
 */
C.Extension.Storage = C.Utils.Inherit(function (base, options) {

    if (!options) { throw 'Missing parameters'; }

    base();

    this._package_name = options.package_name;

}, EventEmitter, 'C.Extension.Storage');

/**
 * Get data from local storage.
 *
 * @method get
 * @public
 * @param {Object} key Data key.
 * @return {Object} Value for key.
 * @example
 *      var my_var = E.Storage.get('my_key');
 */
C.Extension.Storage.prototype.get = function (key) {

    var internal_key = this._package_name + '-' + key;
    return localStorage.getItem(internal_key);
};

/**
 * Set data in local storage.
 *
 * @method set
 * @public
 * @param {Object} key Data key.
 * @param {Object} value Data.
 * @example
 *      E.Storage.set('my_key', my_var);
 */
C.Extension.Storage.prototype.set = function (key, value) {

    var internal_key = this._package_name + '-' + key;
    return localStorage.setItem(internal_key, value);
};
