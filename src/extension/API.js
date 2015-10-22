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
            FeatureGroup_class: C.Geo.FeatureGroup,
            BoundedLayer: C.Geo.BoundedLayer_new_ctr,
            Bounds: C.Geometry.Bounds_new_ctr,
            Text: C.Geo.Feature.Text_new_ctr,
            //            LayerGroup: C.Helpers.layermanager.createGroup.bind(C.Helpers.layermanager, context),

            Popup: C.UI.Popup_new_ctr.bind(context),

            /*
             *  Geometry
            */
            LatLng: C.Geometry.LatLng_new_ctr,
            Point: C.Geometry.Point_new_ctr,

            Events: C.System.Events,
            Viewport: C.Helpers.viewport,
            Schema: C.Helpers.viewport._schema,
            CoordinatesHelper: C.Helpers.CoordinatesHelper,
            ProjectionsHelper: C.Helpers.ProjectionsHelper,
            Utils: C.Utils,
            Extension: C.Extension.Extension_ctr.bind(context)
        },
        E: {
            Display: context._module.ui.display.bind(context._module.ui),
            Select: context._module.ui.select.bind(context._module.ui),
            '$': context._module.ui.select.bind(context._module.ui),
            Strings: context._module.strings,
            map: context._module._rootLayer,
            Storage: context._storage,
            onload: function (callback) {
                context._module.global.onLoaded = callback;
                if (context._module.ui._isLoaded) {
                    return context._module.ui._loaded();
                }
            },
            ondestroy: function (callback) {
                context._module.global.onDestroyed = callback;
                if (context._module.ui._isDestroyed) {
                    return context._module.ui._destroyed();
                }
            }
        },
        module: {
            exports: {}
        },
        //        exports: {}, //TODO this is an hot fix, link module.exports and exports
        require: C.Extension.Require.bind(context),
        window: (options.originalWindow) ? (window) : (context._module.global)
    };
};
