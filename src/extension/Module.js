/*
 *  C.Extension.Module //TODO description
 */

'use strict';

C.Extension.Module = function (context, strings, layerManager) {

    this._context = context;

    this.exports = {};

    this.strings = strings;

    this.global = {};

    this.ui = new C.Extension.UI.UI(this._context);

    this.layerHelper = new C.Extension.LayerHelper(layerManager, this._context);
};
