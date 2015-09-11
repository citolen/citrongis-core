/*
 *  C.Utils.Object  //TODO description
 */

C.Utils.Object.copy = function (obj) {
    var copy = {};
    var i;

    for (i in obj) {
        copy[i] = obj[i];
    }
    return (copy);
};

C.Utils.Object.merge = function (obj1, obj2) {
    var i;

    for (i in obj2) {
        obj1[i] = obj2[i];
    }
    return (obj1);
};
