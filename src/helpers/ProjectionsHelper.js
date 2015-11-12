/*
 *  C.Helpers.ProjectionHelper //TODO description
 */

'use strict';

//TODO rename to ProjectionHelper

/**
 * Projections Helper
 *
 * @class ProjectionsHelper
 * @namespace C
 */

/**
 * ESPG 4326 (WGS84) "GPS"
 * @property WGS84
 * @type Proj4
 * @example
 *      C.Helpers.ProjectionsHelper.WGS84
 */
/**
 * EPSG 3857 "Web mercator"
 * @property EPSG3857
 * @type Proj4
 * @example
 *      C.Helpers.ProjectionsHelper.EPSG3857
 */
C.Helpers.ProjectionsHelper.WGS84 = new proj4.Proj('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');

C.Helpers.ProjectionsHelper.EPSG3857 = new proj4.Proj('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

C.Helpers.ProjectionsHelper._projectionMap = {
    'epsg:3857': C.Helpers.ProjectionsHelper.EPSG3857,
    'epsg:4326': C.Helpers.ProjectionsHelper.WGS84
};

C.Helpers.ProjectionsHelper.getProjectionFromName = function (name) {
    if (name in C.Helpers.ProjectionsHelper._projectionMap) {
        return C.Helpers.ProjectionsHelper._projectionMap[name];
    }
    return undefined;
};

C.Helpers.ProjectionsHelper.getProjectionName = function (projection) {
    for (var key in C.Helpers.ProjectionsHelper._projectionMap) {
        if (C.Helpers.ProjectionsHelper._projectionMap[key] == projection) {
            return key;
        }
    }
    return undefined;
};
