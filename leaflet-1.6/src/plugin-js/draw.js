const draw = function () {
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
                    "/leaflet1.6/plugin/draw/leaflet.draw.js",
                    "/leaflet1.6/plugin/draw/leaflet.draw.css",
                ].map(_ => (window.relativePath || "") + _));
            } else {
                cb();
            }
            return this;
        },
        initDraw() {
            // FeatureGroup is to store editable layers
            evalFn(`initDraw("${myMap}")`);
            return this;
        }
    };
}