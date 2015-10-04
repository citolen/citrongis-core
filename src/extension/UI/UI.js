/*
 *  C.Extension.UI.UI //TODO description
 */

'use strict';

dust.helpers.include = function (chunk, context, bodies, params) {
    return chunk.map(function (chunk) {
        var extension_context = context.stack.head._context;
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

    this._classList = [];

    this._selector = undefined;

    this._isLoaded = false;

}, EventEmitter, 'C.Extension.UI.UI'), C.Extension.UI.Bridge, 'C.Extension.UI.UI');

C.Extension.UI.UI.prototype.addClass = function (classname) {
    this._classList.push(classname);
    if (this._container) {
        this._container.classList.add(classname);
    }
};

C.Extension.UI.UI.prototype.select = function (selector) {
    if (this._selector) {
        return this._selector.find(selector);
    }
};

C.Extension.UI.UI.prototype._loaded = function () {
    if (this._context._module.global.onLoaded !== undefined &&
        typeof this._context._module.global.onLoaded === 'function') {
        this._context._module.global.onLoaded(this._container);
    }
};

//TODO make this plateform independent
C.Extension.UI.UI.prototype.display = function (path, nowindow) {

    var self = this;
    C.Extension.Require.call(this._context, path, function (err, data) {
        var name = self._context._package.name + path;
        var compiled = dust.compile(data, name);
        dust.loadSource(compiled);

        //TODO bind context
        var context = C.Utils.Context.copy(self._context);
        context.currentPath = path;
        var citrongisCtx = {
            _context: context
        };

        C.Utils.Object.merge(citrongisCtx, self._context._module.global);

        dust.render(name, citrongisCtx, function (err, output) {

            if (!self._container) {
                self._container = document.createElement('div');
                var header = document.createElement('div');
                header.classList.add('citrongisextension-header');
                header.innerHTML = self._context._package.name;
                self._container.classList.add('citrongisextension-handler');
                for (var i = 0; i < self._classList.length; ++i) {
                    self._container.classList.add(self._classList[i]);
                }
                self._container.appendChild(header);
                self._selector = $(self._container);
            }

            if (nowindow) {
                self._container = document.createElement('div');
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; i < nodes.length; ++i) {
                    $(self._container).append(nodes[i]);
                }
                for (var i = 0; i < self._classList.length; ++i) {
                    self._container.classList.add(self._classList[i]);
                }
                self._selector = $(self._container);
                self.emit('display', self._container, nowindow);
            } else {
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; i < nodes.length; ++i) {
                    $(self._container).append(nodes[i]);
                }
                self.emit('display', self._container);
            }

            self._isLoaded = true;

            self._loaded();
        });
    });
};
