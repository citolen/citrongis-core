/*
 *  C.Extension.UI.Include //TODO description
 */

'use strict';

C.Extension.UI.Include = function (filepath) {

    var file_extension = filepath.lastIndexOf('.');

    if (file_extension == -1 || file_extension == filepath.length) {
        file_extension = 'js';
    } else {
        file_extension = filepath.substr(file_extension + 1);
    }

    if (file_extension == 'js') {
        //TODO add debug
        //console.log('[JS include]', filepath);
        C.Extension.Require.call(this, filepath);
    }
    if (file_extension == 'css') {
        //TODO add debug
        //console.log('[CSS include]', filepath);
        //TODO make an upper function to deal with import of css
        var s = document.createElement('style');
        s.innerHTML = C.Extension.Require.call(this, filepath);

        document.getElementsByTagName('head')[0].appendChild(s);
    }
};
