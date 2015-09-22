/*
 *  C.Geo.Feature.Feature
 */

'use strict';

C.Geo.Feature.Feature = C.Utils.Inherit(function (base, type, options) {
    base();

    options = options || {};

    this._dirty = false;

    this._mask = 0;

    this._type = type;

    this._opacity = (options.opacity != undefined) ? (options.opacity) : 1.0;

    this._events = {};

    this._metadata = options.metadata || {};

    this._interactive = options.interactive || false;

}, EventEmitter, 'C.Geo.Feature.Feature');

C.Geo.Feature.Feature.OpacityMask = 1024;
C.Geo.Feature.Feature.InteractiveMask = 2048;
C.Geo.Feature.Feature.InteractiveEvents = ['click', 'mousedown', 'mousemove', 'mouseup'];

C.Geo.Feature.Feature.EventType = {
    ADDED: 0,
    REMOVED: 1,
    UPDATED: 2
};

C.Geo.Feature.Feature.FeatureType = {
    CIRCLE: 0,
    IMAGE: 1,
    LINE: 2,
    POLYGON: 3
};

C.Geo.Feature.Feature.prototype.on = function (eventName) {
    if (!this._interactive && C.Geo.Feature.Feature.InteractiveEvents.indexOf(eventName) != -1) {
        this._mask |= C.Geo.Feature.Feature.InteractiveMask;
        this._interactive = true;
        this.makeDirty();
    }
    EventEmitter.prototype.on.apply(this, arguments);
};

C.Geo.Feature.Feature.prototype.once = function (eventName) {
    if (!this._interactive && C.Geo.Feature.Feature.InteractiveEvents.indexOf(eventName) != -1) {
        this._mask |= C.Geo.Feature.Feature.InteractiveMask;
        this._interactive = true;
        this.makeDirty();
    }
    EventEmitter.prototype.once.apply(this, arguments);
};

C.Geo.Feature.Feature.prototype.addTo = function (container) {
    if (container instanceof C.Geo.Layer) {
        return container.addFeature(this);
    }
};

C.Geo.Feature.Feature.prototype.set = function (key, value) {
    this._metadata[key] = value;
    return value;
};

C.Geo.Feature.Feature.prototype.get = function (key) {
    if (key in this._metadata) {
        return this._metadata[key];
    }
    return null;
};

C.Geo.Feature.Feature.prototype.opacity = function (opacity) {
    if (opacity == undefined || this._opacity == opacity) {
        return (this._opacity);
    }

    this._mask |= C.Geo.Feature.Feature.OpacityMask;
    this._opacity = opacity;
    this.makeDirty();
    return this._opacity;
};

C.Geo.Feature.Feature.prototype.makeDirty = function () {
    this._dirty = true;
    this.emit('dirty', this);
};

C.Geo.Feature.Feature.prototype.__mousedown = function (event) {
    this.emit('mousedown', this, event);
};

C.Geo.Feature.Feature.prototype.__mousemove = function (event) {
    this.emit('mousemove', this, event);
};

C.Geo.Feature.Feature.prototype.__mouseup = function (event) {
    this.emit('mouseup', this, event);
};

C.Geo.Feature.Feature.prototype.__click = function (event) {
    this.emit('click', this, event);
};

C.Geo.Feature.Feature.prototype.addEventListener = function (event, fct) {

};

C.Geo.Feature.Feature.prototype.bindPopup = function (popup) {

    this.on('click', function (feature, event) {

        popup.open(event);

    });

    return popup;
};
