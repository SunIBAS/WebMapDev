const geoman = function () {
    let init = false;
    let myMap = "";
    let evalFn = () => {};
    return {
        init(theIfrInstance,cb) {
            if (!init) {
                init = true;
                myMap = theIfrInstance.myMap();
                evalFn = theIfrInstance.eval.bind(theIfrInstance);

                theIfrInstance.insertJSandCSS(cb,[
                    "/leaflet1.6/plugin/leaflet-geoman/leaflet-geoman.min.js",
                    "/leaflet1.6/plugin/leaflet-geoman/leaflet-geoman.css",
                ].map(_ => (window.relativePath || "") + _));
            } else {
                cb();
            }
            return this;
        },
        initDraw() {
            // FeatureGroup is to store editable layers
            evalFn(`initGeoman("${myMap}")`);
            return this;
        }
    };
}