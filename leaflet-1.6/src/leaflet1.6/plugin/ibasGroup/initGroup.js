/* eslint-disable no-undef */

window.ips = {
    api: {
        geoserver: "http://10.10.1.132:8080"
    }
}
const baseMap = {
    google: {
        type: 'layer',
        url: 'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga'
    },
    // "中亚无云遥感TM 30m": {
    //     type: 'wms',
    //     url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
    //     params: {
    //         "format": "image/png",
    //         "VERSION": "1.1.1",
    //         "layers": "ditu:google3857",
    //         "transparent": true,
    //     }
    // },
    '无': {
        type: 'layer',
        url: ''
    },
};

const overlap = {
    "基础要素": {
        "铁路": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca2_rail",
                "transparent": true
            }
        },
        "湖泊": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca4_lake",
                "transparent": true,
                styles: ''
            }
        },
        "河流": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca4_main_river_arc",
                "transparent": true,
                styles: ''
            }
        },
        "道路": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca3_road",
                "transparent": true,
                styles: ''
            }
        },
        "整合": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:中亚五国行政",
                "transparent": true
            }
        },
        "地名": {
            show: true,
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bougj_Anno",
                "transparent": true,
                styles: ''
            }
        },
    },
    "边界": {
        "五国外边界": {
            show: true,
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca0_outln",
                "transparent": true
            }
        },
        "国界": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bougj_ln",
                "transparent": true
            }
        },
        "州界": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bouzj_ln",
                "transparent": true
            }
        },
        "大湖区边界": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:Aral_Sea_merge,ditu:Balkash,ditu:Issyk,ditu:big_lake_name",
                "transparent": true,
                // styles: "ditu:主要河流",
            }
        },
    },
    "地名": {
        "地名": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bougj_Anno",
                "transparent": true,
                styles: ''
            }
        },
        "首府": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca5_respt_rank1",
                "transparent": true,
                styles: ''
            }
        },
        "县": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca5_respt_rank4",
                "transparent": true,
                styles: ''
            }
        },
        "主要城市": {
            type: 'wms',
            url: `${window.ips.api.geoserver}/geoserver/ditu/wms`,
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:中亚五国主要城市",
                "transparent": true,
                styles: ''
            }
        },
    },
};

// eslint-disable-next-line no-unused-vars
const buildLayerControl = (function(baseMap, overlap) {
    window.cache_geojson = (typeof window.cache_geojson === 'object') ? window.cache_geojson : {};
    /**
     * todo shp 未完成编写
     * @param layer
     * @return {*}
     */
    const getLayer = (layer,zIndex) => {
        let showGeoJson = function (geojson, weight, color1) {
            return L.geoJSON(geojson, {
                style: function () {
                    return {
                        color: color1,
                        weight: weight
                    };
                }
            });
        };
        if (layer.type === 'layer') {
            return L.tileLayer(layer.url);
        } else if (layer.type === 'wms') {
            return L.tileLayer.wms(layer.url, Object.assign({
                style: ''
            }, zIndex ? { zIndex } : {} ,layer.params));
        } else if (layer.type === 'shp') {
            if (layer.url in window.cache_geojson) {
                return new Promise(s => {
                    s(showGeoJson.bind(null, window.cache_geojson[layer.url]));
                });
            } else {
                return fetch(layer.url)
                    .then(_ => _.text())
                    .then(JSON.parse)
                    .then(__ => {
                        window.cache_geojson[layer.url] = __;
                        return showGeoJson.bind(null, __);
                    });
            }
        }
    };
    return function (map,fromIndex) {
        let baseLayers = {};
        let first = true;
        fromIndex = fromIndex ? fromIndex : 20;
        for (let i in baseMap) {
            baseLayers[i] = getLayer(baseMap[i]);
            if (first) {
                first = false;
                baseLayers[i].addTo(map);
            }
        }

        let overlayLayers = {};
        for (let i in overlap) {
            overlayLayers[i] = {};
            for (let j in overlap[i]) {
                overlayLayers[i][j] = getLayer(overlap[i][j], fromIndex++);
                overlap[i][j].show ? overlayLayers[i][j].addTo(map) : false;
                // overlayLayers[i][j].addTo(map);
            }
        }
        let controls = L.control.orderlayersIBASGroup(
            baseLayers,
            overlayLayers,
            {
                title: '图层管理'
            }
        );
        map.setMinZoom(4);
        controls.addTo(map);
        window.controls = controls;
        return controls;
    }
})(baseMap, {} /* overlap 之所以不用这个是，你们也没有我这个内网资源，就当作一个例子吧 */);

// eslint-disable-next-line no-unused-vars
const manageMapGroupInstance = function (mapGroup) {
    let toChecked = function(dom,checked) {
        if (dom.checked === checked) {
            return ;
        } else {
            dom.click();
        }
    }
    let forEach = function (tar,yesAction,noAction) {
        noAction = noAction || (() => {});
        let lr = mapGroup._form.getElementsByClassName('leaflet-row');
        for (let i = 0;i < lr.length;i++) {
            let dom = lr[i].getElementsByTagName('input')[0];
            if (dom) {
                if (tar.includes((lr[i].innerText.trim() || '').trim())) {
                    yesAction(dom);
                } else {
                    noAction(dom);
                }
            }
        }
    }
    return {
        open(tar) {
            if (!(tar instanceof Array)) {
                tar = [tar];
            }
            forEach(tar,function (dom) {
                toChecked(dom,true);
            },function (dom) {
                toChecked(dom,false);
            })
        },
        switch(tar) {
            if (!(tar instanceof Array)) {
                tar = [tar];
            }
            forEach(tar,function (dom) {
                toChecked(dom,!dom.checked);
            })
        }
    }
}
