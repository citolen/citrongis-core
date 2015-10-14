/*
 *  C.Geo.Feature.Text //TODO description
 */

'use strict';

C.Geo.Feature.Text = C.Utils.Inherit(function (base, options) {
    base(C.Geo.Feature.Feature.FeatureType.TEXT, options);

    if (options === undefined || options.location == undefined) {
        throw 'Invalid Argument';
    }

    this._location = options.location;

    this._text = options.text;

    this._fill = options.fill;

    this._align = options.align;

    this._font = options.font;

    this._anchor = options.anchor || [0,0];

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Text');

/*
 *  Constructor
 */
C.Geo.Feature.Text_ctr = function (args) {
    return C.Geo.Feature.Text.apply(this, args);
};
C.Geo.Feature.Text_ctr.prototype = C.Geo.Feature.Text.prototype;
C.Geo.Feature.Text_new_ctr = function () {
    return new C.Geo.Feature.Text_ctr(arguments);
};

C.Geo.Feature.Text.MaskIndex = {
    TEXT: 2,
    FILL: 4,
    ALIGN: 8,
    FONT: 16,
    ANCHOR: 32,
    LOCATION: 64
};

C.Geo.Feature.Text.TextAlign = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
};

C.Geo.Feature.Text.prototype = C.Utils.Extends(C.Geo.Feature.Feature.prototype, {

    anchor: function (anchor) {
        if (anchor === undefined || this._anchor === anchor || anchor.constructor !== Array || anchor.length != 2) {
            return this._anchor;
        }

        this._anchor = anchor;
        this._mask |= C.Geo.Feature.Text.MaskIndex.ANCHOR;
        this.emit('anchorChanged', anchor);
        this.makeDirty();
        return this._anchor;
    },

    text: function (text) {
        if (text === undefined || this._text === text) {
            return this._text;
        }

        this._text = text;
        this._mask |= C.Geo.Feature.Text.MaskIndex.TEXT;
        this.emit('textChanged', text);
        this.makeDirty();
        return this._text;
    },

    fill: function (fill) {
        if (fill === undefined || this._fill === fill) {
            return this._fill;
        }

        this._fill = fill;
        this._mask |= C.Geo.Feature.Text.MaskIndex.FILL;
        this.emit('fillChanged', fill);
        this.makeDirty();
        return this._fill;
    },

    align: function (align) {
        if (align === undefined || this._align === align) {
            return this._align;
        }

        this._align = align;
        this._mask |= C.Geo.Feature.Text.MaskIndex.ALIGN;
        this.emit('alignChanged', align);
        this.makeDirty();
        return this._align;
    },

    font: function (font) {
        if (font === undefined || this._font === font) {
            return this._font;
        }

        this._font = font;
        this._mask |= C.Geo.Feature.Text.MaskIndex.font;
        this.emit('fontChanged', font);
        this.makeDirty();
        return this._font;
    },

    location: function (location) {
        if (location === undefined) {
            return this._location;
        }

        this._location = location;
        this._mask |= C.Geo.Feature.Text.MaskIndex.LOCATION;
        this.emit('locationChanged', location);
        this.makeDirty();
        return this._location;
    },

    getBounds: function () {
        return new C.Geometry.Bounds(this._location);
    }

});
