/*
 *  C.Extension.API     //TODO description
 */

C.Extension.API = function (context, options) {

    return {
        C: {
            /*
             *  Features
             */
            Circle: C.Geo.Feature.Circle_new_ctr,
            Image: C.Geo.Feature.Image_new_ctr.bind(context),
            ImageScaleMode: C.Geo.Feature.Image.ScaleMode,
            Line: C.Geo.Feature.Line_new_ctr,
            Polygon: C.Geo.Feature.Polygon_new_ctr,
            FeatureType: C.Geo.Feature.Feature.FeatureType,

            Layer: C.Geo.Layer_new_ctr,
            Layer_class: C.Geo.Layer,
            PerformanceLayer: C.Geo.PerformanceLayer_new_ctr,
            TileLayer: C.Layer.Tile.TileLayer_new_ctr,
            TMSSource: C.Layer.Tile.Source.TMSSource_new_ctr,
            TileSchema: {
                SphericalMercator: C.Layer.Tile.Schema.SphericalMercator,
                SphericalMercatorRetina: C.Layer.Tile.Schema.SphericalMercatorRetina
            },
            FeatureGroup_class: C.Geo.FeatureGroup,
            BoundedLayer: C.Geo.BoundedLayer_new_ctr,
            Bounds: C.Geometry.Bounds_new_ctr,
            Text: C.Geo.Feature.Text_new_ctr,

            Popup: C.UI.Popup_new_ctr.bind(context),

            /*
             *  Geometry
            */
            LatLng: C.Geometry.LatLng_new_ctr,
            Point: C.Geometry.Point_new_ctr,
            Vector2: C.Geometry.Vector2_new_ctr,

            Events: C.System.Events,
            Viewport: C.Helpers.viewport,
            Schema: C.Helpers.viewport._schema,
            CoordinatesHelper: C.Helpers.CoordinatesHelper,
            ProjectionsHelper: C.Helpers.ProjectionsHelper,
            Utils: C.Utils,
            Extension: C.Extension.Extension_ctr.bind(context),
            System: {
                isMobile: C.System.isMobile || (function detectmob() {
                    if( navigator.userAgent.match(/Android/i)
                       || navigator.userAgent.match(/webOS/i)
                       || navigator.userAgent.match(/iPhone/i)
                       || navigator.userAgent.match(/iPad/i)
                       || navigator.userAgent.match(/iPod/i)
                       || navigator.userAgent.match(/BlackBerry/i)
                       || navigator.userAgent.match(/Windows Phone/i)
                      ){
                        return true;
                    }
                    else {
                        return false;
                    }
                })()
            }
        },
        E: {
            Display: context._module.ui.display.bind(context._module.ui),
            Select: context._module.ui.select.bind(context._module.ui),
            '$': context._module.ui.select.bind(context._module.ui),
            Strings: context._module.strings,
            map: context._module._rootLayer,
            Map: context._module._rootLayer,
            Storage: context._storage,
            onload: function (callback) {
                context._module.global.onLoaded = callback;
                if (context._module.ui._isLoaded) {
                    return context._module.ui._loaded();
                }
            },
            ondestroy: function (callback) {
                //                context._module.global.onDestroyed = callback;
                if (context._module.ui._isDestroyed) {
                    return callback();
                } else {
                    context.on('stopped', function (cb) {
                        cb();
                    }.bind(null, callback));
                }
            }
        },
        module: {
            exports: {}
        },
        require: C.Extension.Require.bind(context),
        global: window
        //        window: (options.originalWindow) ? (window) : (context._module.global)
    };
};

/**
 * JQuery selector - select element from your interface
 *
 * @class Select
 * @namespace E
 * @constructor
 * @example
 *      E.Select('#my_id')...
 */

/**
 * JQuery selector - select element from your interface
 *
 * @class $
 * @namespace E
 * @constructor
 * @example
 *      E.$('#my_id')...
 */

/**
 * Map, main element, where to add your layers
 *
 * @class Map
 * @namespace E
 * @constructor
 * @example
 *      my_layer.addTo(E.map);
 */

/**
 * Set callback, called when application is ready
 *
 * @class onload
 * @namespace E
 * @constructor
 * @example
 *      E.onload(function () {
 *          console.log('interface loaded');
 *      });
 */

/**
 * Set callback, called when application is destroyed
 *
 * @class ondestroy
 * @namespace E
 * @constructor
 * @example
 *      E.ondestroy(function () {
 *          console.log('interface destroyed');
 *      });
 */
