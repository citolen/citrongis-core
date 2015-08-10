/*
 *  C.Extension.UI.UI //TODO description
 */

'use strict';

C.Extension.UI.UI = C.Utils.Inherit(C.Utils.Inherit(function (bridgeConstructor, eventEmitterConstructor, context) {

    bridgeConstructor();
    eventEmitterConstructor();

    this._context = context;

    this._current = undefined;

}, EventEmitter, 'C.Extension.UI.UI'), C.Extension.UI.Bridge, 'C.Extension.UI.UI');

//TODO make this plateform independent
C.Extension.UI.UI.prototype.display = function (path) {

    var page = C.Extension.Require.call(this._context, path);
    if (!page) {
        return;
    }

    var context = C.Utils.Context.copy(this._context);
    context.currentPath = path;
    var citrongisCtx = {
        require: C.Extension.Require.bind(context),
        include: C.Extension.UI.Include.bind(context)
    };

    var result = new EJS({text: page}).render(this._context.module.global, {}, citrongisCtx);

    var handler = $.parseHTML(result)[1];
    handler.classList.add('citrongisextension-handler');
    this.current = handler;
    this.emit('display', handler);
    if (this._context.module.global.onLoaded !== undefined && typeof this._context.module.global.onLoaded === 'function') {
        this._context.module.global.onLoaded(handler);
    }
};
