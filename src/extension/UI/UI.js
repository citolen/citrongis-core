/*
 *  C.Extension.UI.UI //TODO description
 */

'use strict';

dust.helpers.include = function (chunk, context, bodies, params) {
    return chunk.map(function (chunk) {
        var extension_context = context.stack.head._context
        C.Extension.UI.Include.call(extension_context, params.src, function (err) {
            if (err) {
                console.log('[fail]', params.src, 'unable to load');
            }
            chunk.end();
        });
    });
};

C.Extension.UI.UI = C.Utils.Inherit(C.Utils.Inherit(function (bridgeConstructor, eventEmitterConstructor, context) {

    bridgeConstructor();
    eventEmitterConstructor();

    this._context = context;

    this._current = undefined;

    this._container = undefined;

}, EventEmitter, 'C.Extension.UI.UI'), C.Extension.UI.Bridge, 'C.Extension.UI.UI');

//TODO make this plateform independent
C.Extension.UI.UI.prototype.display = function (path, nowindow) {

    var self = this;
    var page = C.Extension.Require.call(this._context, path, function (err, data) {
        var name = self._context._package.name + path;
        var compiled = dust.compile(data, name);
        dust.loadSource(compiled);

        //TODO bind context
        var context = C.Utils.Context.copy(self._context);
        context.currentPath = path;
        var citrongisCtx = {
            _context: context
            //            require: C.Extension.Require.bind(context),
            //            include: C.Extension.UI.Include.bind(context)
        };

        C.Utils.Object.merge(citrongisCtx, self._context._module.global);

        dust.render(name, citrongisCtx, function (err, output) {

            if (!self._container) {
                self._container = document.createElement('div');
                var header = document.createElement('div');
                header.classList.add('citrongisextension-header');
                header.innerHTML = self._context._package.name;
                self._container.classList.add('citrongisextension-handler');
                self._container.appendChild(header);
            }

            if (nowindow) {
                var container = document.createElement('div');
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; i < nodes.length; ++i) {
                    $(container).append(nodes[i]);
                }
                self.emit('display', container, nowindow);
            } else {
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; i < nodes.length; ++i) {
                    $(self._container).append(nodes[i]);
                }
                self.emit('display', self._container);
            }

            if (self._context._module.global.onLoaded !== undefined &&
                typeof self._context._module.global.onLoaded === 'function') {
                self._context._module.global.onLoaded(self._container);
            }
        });
    });
    //    if (!page) {
    //        return;
    //    }
    //
    //    var context = C.Utils.Context.copy(this._context);
    //    context.currentPath = path;
    //    var citrongisCtx = {
    //        require: C.Extension.Require.bind(context),
    //        include: C.Extension.UI.Include.bind(context)
    //    };
    //
    //    var result = new EJS({text: page}).render(this._context.module.global, {}, citrongisCtx);
    //
    //    var nodes = $.parseHTML(result, document, true);
    //    var handler;
    //    for (var i = 0; i < nodes.length; ++i) {
    //        if (nodes[i].nodeName != '#text') {
    //            handler = nodes[i];
    //        }
    //    }
    //    handler.classList.add('citrongisextension-handler');
    //    this.current = handler;
    //    this.emit('display', handler);
    //    if (this._context.module.global.onLoaded !== undefined && typeof this._context.module.global.onLoaded === 'function') {
    //        this._context.module.global.onLoaded(handler);
    //    }
};
