/*
 *  C.Extension.LayerHelper //TODO description
 */

'use strict';

C.Extension.LayerHelper = function (layerManager, owner) {
    this._owner = owner;

    this._manager = layerManager;

    this.groups = this._manager.groups.bind(this._manager, this._owner);

    this.createGroup = this._manager.createGroup.bind(this._manager, this._owner);

    this.deleteGroup = this._manager.createGroup.bind(this._manager, this._owner);

    this.createLayer = (function (option) {
        option = option || {};
        option.owner = this._owner;
        return (new C.Geo.Layer(option));
    }).bind(this);
};
