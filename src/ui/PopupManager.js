/*
 *  C.UI.PopupManager   //TODO description
 */

'use strict';

C.UI.PopupManager = {

    popupcontainer: undefined,

    init: function (rootdiv) {

        this.popupcontainer = document.createElement('DIV');
        this.popupcontainer.id = '__popupContainer';
        /*this.popupcontainer.style.width = $(rootdiv).width();
        this.popupcontainer.style.height = $(rootdiv).height();*/

        rootdiv.appendChild(this.popupcontainer);

        C.Helpers.viewport.on('move', C.UI.PopupManager.update);
    },

    resize: function (width, height) {
        /*this.popupcontainer.style.width = width;
        this.popupcontainer.style.height = height;*/
    },

    popups: []

};

C.UI.PopupManager.update = function () {
    for (var i = 0, j = C.UI.PopupManager.popups.length; i < j; ++i) {
        C.UI.PopupManager.updatePopup(C.UI.PopupManager.popups[i]);
    }
};

C.UI.PopupManager.updatePopup = function (popup) {
    switch (popup.feature._type) {
        case C.Geo.Feature.Feature.FeatureType.CIRCLE:

            var screenPosition = C.Helpers.viewport.worldToScreen(popup.feature.__location.X, popup.feature.__location.Y);

            var w = popup.dom.offsetWidth;
            var h = popup.dom.offsetHeight;

            var x = screenPosition.X - (w / 2);
            var y = screenPosition.Y - h - popup.feature._radius + 3;

            x = Math.floor(x + 0.5);
            y = Math.floor(y + 0.5);

            //TODO do better
            popup.dom.style.transform = "translate("+x+"px,"+y+"px)";

            break;
        default:

            break;
    }
};

C.UI.PopupManager.register = function (popup) {
    if (C.UI.PopupManager.popups.indexOf(popup) != -1) {
        return;
    }
    C.UI.PopupManager.popups.push(popup);
    C.UI.PopupManager.popupcontainer.appendChild(popup.dom);
    C.UI.PopupManager.updatePopup(popup);
};

C.UI.PopupManager.unregister = function (popup) {
    var idx;
    if ((idx = C.UI.PopupManager.popups.indexOf(popup)) == -1) {
        return;
    }
    C.UI.PopupManager.popups.splice(idx, 1);
    C.UI.PopupManager.popupcontainer.removeChild(popup.dom);
};
