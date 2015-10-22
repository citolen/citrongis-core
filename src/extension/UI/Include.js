/*
 *  C.Extension.UI.Include //TODO description
 */

'use strict';

C.Extension.UI.GenerateCSSUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

C.Extension.UI.Include = function (filepath, callback) {

    var self = this;
    var file_extension = filepath.lastIndexOf('.');

    if (file_extension == -1 || file_extension == filepath.length) {
        file_extension = 'js';
    } else {
        file_extension = filepath.substr(file_extension + 1);
    }

    if (file_extension == 'css') {
        //TODO add debug
        //console.log('[CSS include]', filepath);

        return C.Extension.Require.call(this, filepath, function (err, data) {
            if (err) {
                return callback(true);
            }
            var uid = self._package.name + '-' + C.Extension.UI.GenerateCSSUID();

            var isolatedCSS = '.' + uid + '{\n'+data+'\n}';
            less.render(isolatedCSS, function (e, output) {
                self._module.ui.addClass(uid);
                var s = document.createElement('style');
                s.innerHTML = output.css;
                document.getElementsByTagName('head')[0].appendChild(s);
                callback();
            });
        });
    }
    //    if (file_extension == 'js') {
    //TODO add debug
    //console.log('[JS include]', filepath);
    C.Extension.Require.call(this, filepath, function (err) {
        callback(err);
    });
    //    }
};
