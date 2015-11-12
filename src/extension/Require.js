/*
 *  C.Extension.Require //TODO description
 */

'use strict';

function handleJavascript (context, handle, callback, options) {

    var api = C.Extension.API(context, options);
    var argnames = '';
    var args = [];
    for (var api_key in api) {
        argnames += api_key + ',';
        args.push(api[api_key]);
    }
    argnames = argnames.substr(0, argnames.length-1);

    try {
        if (options.windowScope) {
            eval.call(window, handle.asText());
        } else {
            eval('(function (' + argnames + ') {\
' + handle.asText() + '\
}).apply(context._module.global, args);');
        }
        callback.call(context._module.global, null, api.module.exports);
    } catch (e) {
        callback.call(context._module.global, e);
    }
};

function handleDefault (context, handle, callback) {
    callback(null, handle.asText());
}

function handleExtensionType (context, handle, extension, callback, options) {
    switch (extension) {
        case 'js':
            handleJavascript(context, handle, callback, options);
            break;
        default:
            handleDefault(context, handle, callback);
            break;
    }
};

C.Extension.Require_single = function (path, callback, options) {
    var self = this;
    var pathType = C.Utils.Path.getType(path);
    switch (pathType) {
        case 0: //web

            var fail = function () {
                //TODO find a best way
                var oldWrite = document.write;
                document.write = function () {
                    var body = $(document.body);
                    body.append.apply(body, arguments);
                };

                $.getScript(path, function (err) {
                    document.write = oldWrite;
                    callback(err);
                });
            };
            if (options.windowScope) {
                return fail();
            }

            $.get(path, function (data) {
                handleExtensionType(self,
                                    {
                    asText: function (data) { return data; }.bind(null, data)
                },
                                    C.Utils.Path.getExtension(path),
                                    callback,
                                    options);
            }, "text").fail(fail);

            break;
        case 1: //relative to app

            this._resources.file(path, function (err, handle) {
                if (err) {
                    return callback(err);
                }

                handleExtensionType(self,
                                    handle,
                                    C.Utils.Path.getExtension(path),
                                    callback,
                                    options);
            });
            break;
    }
};

/**
 * Require a local or outside file. If it's javascript it will executed in the application context.
 *
 * @namespace
 * @class require
 * @constructor
 * @param {String,Path} path Absolute or relative path to a file.
 * @param {Function} callback Callback when file is loaded.
 * @param {Object} [options] Data.
 * @param {Boolean} [options.originalWindow] If true the global object window will not be replace.
 * @example
 *      require('https://....../my_lib.js', function (err, exports) {});
 *
 *      require(['https://....../my_lib.js', ...], function (err, exports Array<Object>) {});
 */
C.Extension.Require = function (path, callback, options) {
    //TODO debug
    //    console.log('[require]', path, 'from', this.currentPath);

    if (!callback) { callback = function(){}; }
    var self = this;

    options = options || {};
    if (path.constructor === Array) {
        var exports = [];
        async.eachSeries(path, function (item, cb) {
            C.Extension.Require_single.call(self, item, function (err, expt) {
                exports.push(expt);
                cb(err);
            }, options);
        }, function (err) {
            callback.call(self._module.global, err, exports);
        });
    } else {
        C.Extension.Require_single.call(this, path, function () {
            callback.apply(self._module.global, arguments);
        }, options);
    }
};
