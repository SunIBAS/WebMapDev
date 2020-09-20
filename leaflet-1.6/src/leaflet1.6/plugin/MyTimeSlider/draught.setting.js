const draughtSetting = {
    url: 'http://10.10.1.132:8080/geoserver/draught/wms',
    wmsOption: {
        // "layers": "draught:vswi_2019_11",(这个会变化)
        "styles": "draught:vswi",
        "service": "WMS",
        "request": "GetMap",
        "format": "image/png",
        "transparent": "true",
        "VERSION": "1.1.1",
        "srs": "EPSG",
        zIndex: 10,
    },
    formParamFunction: (time) => {
        let t = time.split('-');
        return {
            "layers": `draught:vswi_${t[0]}_${t[1]}`,
            "styles": "draught:vswi",
        }
    },
    timeList: ['2018-1','2018-3','2018-5','2018-7','2018-9','2018-11','2018-13','2018-15',],
    // from: 0,
    // timeout: 2000
}
const AddMyTimeSliderDraught = function (map) {
    AddMyTimeSlider(map,draughtSetting.url,draughtSetting.wmsOption,draughtSetting.formParamFunction,draughtSetting.timeList);
}