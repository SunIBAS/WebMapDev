const Graphic = function () {
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
                    "/leaflet1.6/plugin/Graphic/GeoJson.js",
                ].map(_ => (window.relativePath || "") + _));
            } else {
                cb();
            }
            return this;
        },
        initGraphic() {
            // FeatureGroup is to store editable layers
            evalFn(`initGraphic("${myMap}")`);
            return this;
        }
    };
}