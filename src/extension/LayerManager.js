/*
 *  C.Extension.LayerManager //TODO description
 */

'use strict';

C.Extension.LayerManager = C.Utils.Inherit(function (base) {

    'use strict';

    base();

    this._layerGroups = [];

    this._featureChange = FeatureChange.bind(this);

    this._layerChange = LayerChange.bind(this);

}, EventEmitter, 'C.Extension.LayerManager');

C.Extension.LayerManager.prototype._groups = function () {
    var result = [];
    for (var i = 0; i < this._layerGroups.length; i++) {
        var g = this._layerGroups[i];
        result.push({
            name: g._name,
            group: g,
            idx: i
        });
    }
    return (result);
};

C.Extension.LayerManager.prototype.groups = function (owner) {
    if (owner === undefined) {
        throw 'Invalid Arguments';
    }

    var result = [];
    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner) {
            result.push({
                name: g._name,
                group: g,
                idx: i
            });
        }
    }
    return (result);
};

C.Extension.LayerManager.prototype.createGroup = function (owner, options) {
    if (owner === undefined) {
        throw 'Invalid Owner';
    }

    options = options || {};
    options.owner = owner;

    var group = new C.Extension.LayerGroup(options);
    this._layerGroups.push(group);

    group.on('featureChange', this._featureChange);
    group.on('layerChange', this._layerChange);

    this.notifyGroupChange(C.Extension.LayerGroup.EventType.ADDED, group);
    this.emit('groupCreated', group);
    return (group);
};

C.Extension.LayerManager.prototype.deleteGroup = function (owner, instanceOrName) {
    if (owner === undefined || instanceOrName === undefined) {
        throw 'Invalid Arguments';
    }

    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner && (g === instanceOrName || g._name === instanceOrName)) {

            g.off('featureChange', this._featureChange);
            g.off('layerChange', this._layerChange);
            this._layerGroups.splice(i, 1);

            this.notifyGroupChange(C.Extension.LayerGroup.EventType.REMOVED, g);
            this.emit('groupDeleted', g);

            return (true);
        }
    }
    return (false);
};

C.Extension.LayerManager.prototype.moveGroup = function (owner, instanceOrName, idx) {

    if (owner === undefined ||
        instanceOrName === undefined ||
        idx < 0 || idx >= this._layerGroups.length) {
        throw 'Invalid Arguments';
    }

    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner && (g === instanceOrName || g._name === instanceOrName)) {
            if (i === idx) {
                return (false);
            }
            this._layerGroups.splice(i, 1);
            this._layerGroups.splice(idx, 0, g);

            this.notifyGroupChange(C.Extension.LayerGroup.EventType.MOVED, group);
            this.emit('groupMoved', {group: g, idx: idx});
            return (true);
        }
    }
    return (false);
};

C.Extension.LayerManager.prototype.notifyGroupChange = function (eventType, group) {
    this.emit('groupChange', eventType, group);
};

function FeatureChange(eventType, feature, layer) {
    this.emit('featureChange', eventType, feature, layer);
};

function LayerChange(eventType, feature) {
    this.emit('layerChange', eventType, feature);
};
