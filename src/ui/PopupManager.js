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

C.UI.PopupManager.updatePopup = function (popup, event) {
    if (!popup.location) {
        if (event) {
//            var ex = event.offsetX;
//            var ey = event.offsetY;
//            if (!ex || !ey) {
//                if (event.changedTouches.length > 0) {
//                    ex = event.changedTouches[0].pageX;
//                    ey = event.changedTouches[0].pageY;
//                }
//            }
            var screenPosition = event.getScreenPosition();
            popup.location = C.Helpers.viewport.screenToWorld(screenPosition.X, screenPosition.Y);
            if (popup.feature.location) {
                var location;
                location = popup.feature.location();
                location = C.Helpers.CoordinatesHelper.TransformTo(location, C.Helpers.viewport._schema._crs);
                var position = C.Helpers.viewport.worldToScreen(location.X, location.Y);
                popup.offset = {
                    x: screenPosition.X - position.X,
                    y: screenPosition.Y - position.Y
                };
            }
        } else { return; }
    }

    var w = popup.dom.offsetWidth;
    var h = popup.dom.offsetHeight;
    var x, y;

    if (popup.offset) {
        var location = popup.feature.location();
        location = C.Helpers.CoordinatesHelper.TransformTo(location,
                                                           C.Helpers.viewport._schema._crs);
        var screenPosition = C.Helpers.viewport.worldToScreen(location.X, location.Y);
        x = (screenPosition.X + popup.offset.x) - (w / 2);
        y = (screenPosition.Y + popup.offset.y) - h;
    } else {
        var screenPosition = C.Helpers.viewport.worldToScreen(popup.location.X, popup.location.Y);
        x = screenPosition.X - (w / 2);
        y = screenPosition.Y - h;
    }

    x = Math.floor(x + 0.5);
    y = Math.floor(y + 0.5);

    //TODO do better
    //    popup.dom.style.transform = "translate("+x+"px,"+y+"px)";
    popup.dom.style.top = y + 'px';
    popup.dom.style.left = x + 'px';
};

C.UI.PopupManager.propagateCSSContext = function (popup) {
    var classList = popup._context._module.ui._classList;

    for (var i = 0; i < classList.length; ++i) {
        popup._wrapper.classList.add(classList[i]);
    }
};

C.UI.PopupManager.register = function (popup, event) {
    if (C.UI.PopupManager.popups.indexOf(popup) != -1) {
        return;
    }
    popup._managerCallback = C.UI.PopupManager.updatePopup.bind(null, popup);
    popup.feature.on('locationChanged', popup._managerCallback);
    $(popup.dom).resize(popup._managerCallback);
    C.UI.PopupManager.popups.push(popup);
    C.UI.PopupManager.propagateCSSContext(popup);
    C.UI.PopupManager.popupcontainer.appendChild(popup.dom);
    C.UI.PopupManager.updatePopup(popup, event);
};

C.UI.PopupManager.unregister = function (popup) {
    var idx;
    if ((idx = C.UI.PopupManager.popups.indexOf(popup)) == -1) {
        return;
    }
    if (popup._managerCallback) {
        popup.feature.off('locationChanged', popup._managerCallback);
        $(popup.dom).removeResize(popup._managerCallback);
        delete popup._managerCallback;
    }
    C.UI.PopupManager.popups.splice(idx, 1);
    C.UI.PopupManager.popupcontainer.removeChild(popup.dom);
    delete popup.location;
};

C.UI.PopupManager.clearFromContext = function (context) {
    for (var i = 0; i < C.UI.PopupManager.popups.length; ++i) {
        var popup = C.UI.PopupManager.popups[i];
        if (popup._context._module == context._module) {
            C.UI.PopupManager.unregister(popup);
            --i;
        }
    }
};
