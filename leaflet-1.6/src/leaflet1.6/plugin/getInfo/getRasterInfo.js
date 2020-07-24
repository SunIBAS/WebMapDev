
const getRasterInfo = function () {
    let map = null;
    return {
        // map 是一个 L.map 对象
        // url 是需要去找的，例如干旱是 http://ip:port/geoserver/draught/wms
        init(_map) {
            map = _map;
            return this;
        },
        // layerName 是图层名称
        // e 是 map 的点击事件取其中的 latlng、layerPoint、containerPoint
        getPointInfo(url,layerName,_e) {
            let e = JSON.parse(_e);
            let BBOX = map.getBounds().toBBoxString();
            let WIDTH = map.getSize().x;
            let HEIGHT = map.getSize().y;
            let X = map.layerPointToContainerPoint(e.layerPoint).x;
            let Y = map.layerPointToContainerPoint(e.layerPoint).y;
            let URL = [
                url,
                '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=',
                layerName,
                '&QUERY_LAYERS=',
                layerName,
                '&STYLES=&BBOX=',
                BBOX,
                '&FEATURE_COUNT=5&HEIGHT=',
                HEIGHT,
                '&WIDTH=',
                WIDTH,
                '&FORMAT=image%2Fpng&INFO_FORMAT=application%2Fjson&SRS=EPSG%3A4326&X=',
                parseInt(X),
                '&Y=',
                parseInt(Y)
            ].join('');
            return fetch(URL)
                .then(_ => _.text()).then(JSON.parse)
                .then(_ => {
                    if (_.features.length) {
                        return {
                            value: _.features[0].properties.GRAY_INDEX,
                            ...e.latlng,
                            geometry: (_.features || null)
                        };
                    } else {
                        return {
                            ...e.latlng,
                            value: 'get_fail'
                        }
                    }
                })
                .then(obj => {
                    map.closePopup();
                    let v = obj.value;
                    L.popup()
                        .setLatLng([obj.lat,obj.lng])
                        .setContent(`<span>value : ${v}</span>`)
                        .openOn(map);
                });
        },
        // 显示干旱指数
        showDraughtInfo() {}
    }
}