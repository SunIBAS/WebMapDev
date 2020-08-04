// ../src/CesiumPlugin/navigation/viewerCesiumNavigationMixin.js
function initNavication(viewer) {
    var options = {};
    options.defaultResetView = Cesium.Rectangle.fromDegrees(71, 3, 90, 14);
    // Only the compass will show on the map
    options.enableCompass= true;
    options.enableZoomControls= true;
    options.enableDistanceLegend= true;
    options.enableCompassOuterRing= true;
    viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
}