/* eslint-disable no-undef */

///////////////////// leaflet-control-orderlayers-ibas-group ////////////////////////
export const baseMap = {
    google: {
        type: 'layer',
        url: 'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga'
    },
    rgb: {
        type: 'wms',
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
        params: {
            "format": "image/png",
            "VERSION": "1.1.1",
            "layers": "ditu:RGB",
            "transparent": true
        }
    }
};

export const overlapGroup = {
    "基础要素": {
        "铁路": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca2_rail",
                "transparent": true
            }
        },
        "地名": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bougj_Anno",
                "transparent": true,
                styles: ''
            }
        },
        "湖泊": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
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
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
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
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca3_road",
                "transparent": true,
                styles: ''
            }
        },
    },
    "边界": {
        "五国外边界": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca0_outln",
                "transparent": true
            }
        },
        "国界": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bougj_ln",
                "transparent": true
            }
        },
        "州界": {
            type: 'wms',
            url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
            params: {
                "format": "image/png",
                "VERSION": "1.1.1",
                "layers": "ditu:ca1_bouzj_ln",
                "transparent": true
            }
        },
    }
};

export const overlap = {
    "铁路": {
        type: 'wms',
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
        params: {
            "format": "image/png",
            "VERSION": "1.1.1",
            "layers": "ditu:ca2_rail",
            "transparent": true
        }
    },
    "地名": {
        type: 'wms',
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
        params: {
            "format": "image/png",
            "VERSION": "1.1.1",
            "layers": "ditu:ca1_bougj_Anno",
            "transparent": true,
            styles: ''
        }
    },
    "湖泊": {
        type: 'wms',
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
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
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
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
        url: 'http://11.11.11.164:8080/geoserver/ditu/wms',
        params: {
            "format": "image/png",
            "VERSION": "1.1.1",
            "layers": "ditu:ca3_road",
            "transparent": true,
            styles: ''
        }
    },
};

export const buildLayerControl = (function(baseMap, overlapGroup, overlap) {
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
    return function (map,fromIndex,group) {
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
        if (group) {
            for (let i in overlapGroup) {
                overlayLayers[i] = {};
                for (let j in overlapGroup[i]) {
                    overlayLayers[i][j] = getLayer(overlapGroup[i][j], fromIndex++);
                    // overlayLayers[i][j].addTo(map);
                }
            }
        } else {
            for (let i in overlap) {
                overlayLayers[i] = getLayer(overlap[i], fromIndex++);
            }
        }
        let controls = (group ? L.control.orderlayersIBASGroup : L.control.orderlayersIBAS).bind(L.control)(
            baseLayers,
            overlayLayers,
            {
                title: '图层管理'
            }
        );
        controls.addTo(map);
        window.controls = controls;
        return controls;
    }
})(baseMap, overlapGroup, overlap);

///////////////////// end leaflet-control-orderlayers-ibas-group ////////////////////////