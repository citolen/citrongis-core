/*
 *  C.UI.Popup  //TODO description
 */

'use strict';

/**
 * Creates a popup
 *
 * @class Popup
 * @namespace C
 * @constructor
 * @param {C.Feature} feature Feature linked to the popup
 * @param {Object} options Data
 * @param {String} options.content Popup content.
 * @param {Boolean} [options.auto] Open popup when added.
 * @example
 *      var popup = C.Popup({
 *          feature: your_feature,
 *          content: '<span>content</span>'
 *      });
 */
C.UI.Popup = function (feature, options) {
    options = options || {};

    this.feature = feature;

    this.dom = document.createElement('div');
    this.dom.className = 'popup-container';

    var wrapper = document.createElement('div');
    wrapper.className = 'popup-wrapper';

    wrapper.innerHTML = options.content;

    var tip = document.createElement('div');
    tip.className = 'popup-tip-container';
    tip.innerHTML = '<div class="popup-tip"></div>';

    var close = document.createElement('a');
    close.innerHTML = 'x';
    close.className = 'popup-close';
    close.href = '#';

    var self = this;
    close.addEventListener('click', function () {
        self.close();
    });

    this.dom.appendChild(wrapper);
    this.dom.appendChild(tip);
    this.dom.appendChild(close);

    if (options.auto) {
        this.open();
    }
};

/*
 *  Constructor
 */
C.UI.Popup_ctr = function (args) {
    return C.UI.Popup.apply(this, args);
};
C.UI.Popup_ctr.prototype = C.UI.Popup.prototype;
C.UI.Popup_new_ctr = function () {
    var obj = new C.UI.Popup_ctr(arguments);
    obj._context = this;
    return obj
};

/**
 * Open the popup
 *
 * @method open
 * @public
 * @param {Event} event Event from click event on feature.
 */
C.UI.Popup.prototype.open = function (event) {

    event = event.data.originalEvent;
    C.UI.PopupManager.register(this, event);

};

/**
 * Close the popup
 *
 * @method close
 * @public
 */
C.UI.Popup.prototype.close = function () {
    C.UI.PopupManager.unregister(this);
};
