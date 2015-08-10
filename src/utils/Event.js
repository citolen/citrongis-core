/*
 *  C.Utils.Event   //TODO description
 */

'use strict';

C.Utils.Event = C.Utils.Inherit(function (base, options) {
    base();

    options = options || {};

}, EventEmitter, 'C.Utils.Event');

C.Utils.Event.prototype.__initialized = function () {

    this.emit('initialized');

};

C.Utils.Event = new C.Utils.Event();
