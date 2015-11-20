/*
 *  C.Geo.Feature.Feature
 */

'use strict';

/**
 * Abstract feature representation
 *
 * @class Feature
 * @namespace C
 * @extends EventEmitter
 * @constructor
 * @param {Object} [options] Data
 * @param {Number} [options.opacity] Opacity of the feature.
 * @param {Object} [options.metadata] Dictionary of metadata.
 */
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

    this._offset = options.offset;

}, EventEmitter, 'C.Geo.Feature.Feature');

C.Geo.Feature.Feature.OpacityMask = 1024;
C.Geo.Feature.Feature.InteractiveMask = 2048;
C.Geo.Feature.Feature.OffsetMask = 4096;
C.Geo.Feature.Feature.GenericMask = 8192;
C.Geo.Feature.Feature.InteractiveEvents = ['click', 'mousedown', 'mousemove', 'mouseup'];

C.Geo.Feature.Feature.EventType = {
    ADDED: 0,
    REMOVED: 1,
    UPDATED: 2,
    MOVED: 3,
    UPDATEPOSITION: 4
};

C.Geo.Feature.Feature.FeatureType = {
    CIRCLE: 0,
    IMAGE: 1,
    LINE: 2,
    POLYGON: 3,
    TEXT: 4
};

C.Geo.Feature.Feature.prototype.__added = function () {
    this.emit('added', this);
};

C.Geo.Feature.Feature.prototype.__removed = function () {
    this.emit('removed', this);
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

/**
 * Add this to a layer
 *
 * @method addTo
 * @public
 * @param {C.Layer} container Layer to add yourself to.
 * @return {Boolean} True is succesfully added.
 */
C.Geo.Feature.Feature.prototype.addTo = function (container) {
    if (container instanceof C.Geo.Layer) {
        return container.addFeature(this);
    }
    return false;
};

/**
 * Set a metadata
 *
 * @method set
 * @public
 * @param {Object} key Key link to value.
 * @param {Object} value Value to store.
 * @return {Object} Added value.
 */
C.Geo.Feature.Feature.prototype.set = function (key, value) {
    this._metadata[key] = value;
    return value;
};

/**
 * Get a metadata
 *
 * @method get
 * @public
 * @param {Object} key Key link to value.
 * @return {Object} Key value or null if not found.
 */
C.Geo.Feature.Feature.prototype.get = function (key) {
    if (key in this._metadata) {
        return this._metadata[key];
    }
    return null;
};

/**
 * Get/Set opacity
 *
 * @method opacity
 * @public
 * @param {Object} [opacity] New opacity.
 * @return {Object} Current or new opacity.
 */
C.Geo.Feature.Feature.prototype.opacity = function (opacity) {
    if (opacity == undefined || this._opacity == opacity) {
        return (this._opacity);
    }

    this._mask |= C.Geo.Feature.Feature.OpacityMask;
    this._opacity = opacity;
    this.makeDirty();
    return this._opacity;
};

/**
 * Get/Set offset
 *
 * @method offset
 * @public
 * @param {Object} [offset] New offset {X:, Y:}.
 * @return {Object} Current or new offset.
 */
C.Geo.Feature.Feature.prototype.offset = function (offset) {
    if (offset == undefined || this._offset == offset) {
        return (this._offset);
    }

    this._mask |= C.Geo.Feature.Feature.OffsetMask;
    this._offset = offset;
    this.makeDirty();
    return this._offset;
};

C.Geo.Feature.Feature.prototype.makeDirty = function () {
    this._dirty = true;
    this.emit('dirty', this);
};

/**
 * Feature on mouse down
 * @event mousedown
 * @param {C.Feature} self
 * @param {Event} event
 */
C.Geo.Feature.Feature.prototype.__mousedown = function (event) {
    this.emit('mousedown', this, event);
};

/**
 * Feature on mouse move
 * @event mousemove
 * @param {C.Feature} self
 * @param {Event} event
 */
C.Geo.Feature.Feature.prototype.__mousemove = function (event) {
    this.emit('mousemove', this, event);
};

/**
 * Feature on mouse up
 * @event mouseup
 * @param {C.Feature} self
 * @param {Event} event
 */
C.Geo.Feature.Feature.prototype.__mouseup = function (event) {
    this.emit('mouseup', this, event);
};

/**
 * Feature on click
 * @event click
 * @param {C.Feature} self
 * @param {Event} event
 */
C.Geo.Feature.Feature.prototype.__click = function (event) {
    this.emit('click', this, event);
};

C.Geo.Feature.Feature.prototype.addEventListener = function (event, fct) {

};

/**
 * Bind a popup to this feature, will open it when clicked
 *
 * @method bindPopup
 * @public
 * @param {C.Popup} popup Popup to bind.
 * @return {C.Popup} Popup given as argument.
 */
C.Geo.Feature.Feature.prototype.bindPopup = function (popup) {

    this.on('click', function (feature, event) {
        popup.toggle(event);
    });

    return popup;
};
