/*
 *  C.Extension.UI.Bridge //TODO description
 */

'use strict';

C.Extension.UI.Bridge = function () {

    this._functions = {};

    this._idCounter = 0;
};

C.Extension.UI.Bridge.prototype.register = function (funct) {
    var id = this._idCounter++;

    this._functions[id] = funct;
    return (id);
};

C.Extension.UI.Bridge.prototype.bridge = function (id) {
    if (id in this._functions) {
        this._functions[id]();
    }
};
