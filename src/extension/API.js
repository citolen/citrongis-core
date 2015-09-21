/*
 *  C.Extension.API     //TODO description
 */

C.Extension.API = function (context) {

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

            Layer: C.Geo.Layer_new_ctr,
            LayerGroup: C.Helpers.layermanager.createGroup.bind(C.Helpers.layermanager, context),

            Popup: C.UI.Popup_new_ctr,

            /*
             *  Geometry
            */
            LatLng: C.Geometry.LatLng_new_ctr,
            Point: C.Geometry.Point_new_ctr,

            Events: C.System.Events,
            Viewport: C.Helpers.viewport,
            CoordinatesHelper: C.Helpers.CoordinatesHelper,
            ProjectionsHelper: C.Helpers.ProjectionsHelper
        },
        E: {
            Display: context._module.ui.display.bind(context._module.ui),
            Select: context._module.ui.select.bind(context._module.ui),
            '$': context._module.ui.select.bind(context._module.ui),
            Strings: context._module.strings
        }
    };
};
