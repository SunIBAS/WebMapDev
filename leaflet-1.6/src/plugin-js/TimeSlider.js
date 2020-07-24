const TimeSlider = function () {
    let init = false;
    let myMap = "";
    let evalFn = () => {};
    let settings = {
        draught: ["/leaflet1.6/plugin/MyTimeSlider/draught.setting.js",]
    };
    return {
        init(theIfrInstance,cb,defaultSetting) {
            let sets = [];
            if (defaultSetting && defaultSetting in settings) {
                sets = settings[defaultSetting];
            }
            if (!init) {
                init = true;
                myMap = theIfrInstance.myMap();
                evalFn = theIfrInstance.eval.bind(theIfrInstance);

                theIfrInstance.insertJSandCSS(cb,[
                    "/leaflet1.6/plugin/MyTimeSlider/index.js",
                    "/leaflet1.6/plugin/TimeDimension@1.1.1/leaflet.timedimension.control.min.css",
                    ...sets
                ].map(_ => (window.relativePath || "") + _));
            } else {
                cb();
            }
            return this;
        },
        refreshTimeSliderPure(url,wmsOption,formParamFunction,timeList,timeout,from) {
            // FeatureGroup is to store editable layers
            evalFn(`AddMyTimeSlider(${myMap},"${url}",'${JSON.stringify(wmsOption)}','${formParamFunction.toString()}','${JSON.stringify(timeList)}',${timeout},${from})`);
            return this;
        },
        refreshTimeSlider(defaultSetting) {
            if (defaultSetting in settings) {
                evalFn(`AddMyTimeSliderDraught(${myMap});`);
            }
        }
    };
}