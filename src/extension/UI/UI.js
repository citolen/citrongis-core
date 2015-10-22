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

    this._contentContainer = undefined;

    this._classList = [];

    this._selector = undefined;

    this._isLoaded = false;

    this._isDestroyed = false;

    this._isMinimized = false;

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

C.Extension.UI.UI.prototype._destroy = function () {
    if (this._context._module.global.onDestroyed !== undefined &&
        typeof this._context._module.global.onDestroyed === 'function') {
        this._context._module.global.onDestroyed(this._container);
    }
};

C.Extension.UI.UI.prototype.destroy = function () {
    this._isDestroyed = true;
    this.emit('destroy', this._container);
    this._destroy();
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

                // Close button
                var close_btn = document.createElement('span');
                close_btn.classList.add('citrongisextension-header-close');
                close_btn.innerHTML = 'x';
                header.appendChild(close_btn);
                $(close_btn).mousedown(function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                });
                $(close_btn).click(function () {
                    self._context.destroy();
                });

                // Minimize button
                var minimize_btn = document.createElement('span');
                minimize_btn.classList.add('citrongisextension-header-minimize');
                minimize_btn.innerHTML = '-';
                header.appendChild(minimize_btn);
                $(minimize_btn).mousedown(function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                });
                $(minimize_btn).click(function () {
                    if (!self._isMinimized) {
                        $(self._contentContainer).hide();
                        minimize_btn.innerHTML = '+';
                    } else {
                        $(self._contentContainer).show();
                        minimize_btn.innerHTML = '-';
                    }
                    self._isMinimized = !self._isMinimized;
                });

                self._container.classList.add('citrongisextension-handler');
                for (var i = 0; i < self._classList.length; ++i) {
                    self._container.classList.add(self._classList[i]);
                }
                self._container.appendChild(header);
                self._contentContainer = document.createElement('div');
                self._container.appendChild(self._contentContainer);
                self._selector = $(self._contentContainer);
            }

            if (nowindow) {
                self._container = document.createElement('div');
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; nodes && i < nodes.length; ++i) {
                    $(self._container).append(nodes[i]);
                }
                for (var i = 0; i < self._classList.length; ++i) {
                    self._container.classList.add(self._classList[i]);
                }
                self._selector = $(self._container);
                self.emit('display', self._container, nowindow);
            } else {
                var nodes = $.parseHTML(output, document, true);
                for (var i = 0; nodes && i < nodes.length; ++i) {
                    $(self._contentContainer).append(nodes[i]);
                }
                self.emit('display', self._container);
            }

            self._isLoaded = true;

            self._loaded();
        });
    });
};
