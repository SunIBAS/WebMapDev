// <script src="../src/MySeal/MarkerAndGraphicManager/jquery.min.js"></script>
// <script src="../src/MySeal/MarkerAndGraphicManager/utils.js"></script>
// <script src="../src/MySeal/MarkerAndGraphicManager/GraphicType.js"></script>
// <script src="../src/MySeal/MarkerAndGraphicManager/Graphic.js"></script>
// <script src="../src/MySeal/MarkerAndGraphicManager/GraphicManager.js"></script>
// <script src="../src/MySeal/MarkerAndGraphicManager/MarkerManager.js"></script>
// <link herf="../src/MySeal/MarkerAndGraphicManager/style.css"></link>

// manager.MarkManager.pick({}) // 创建标记
// manager.GraphicManager.createPolygon() // 创建多边形
const installMarkerAndGraphicManager = function (srcPath) {
    const insertDomToHead = (domType,doFn,onload) => {
        return new Promise(function (s) {
            let dom = document.createElement(domType);
            doFn(dom);
            document.head.append(dom);
            if (onload) {
                dom.onload = function () {
                    s();
                }
            } else {
                s();
            }
        })
    }
    const insertJSFile = (link) => {
        return insertDomToHead('script',function (script) {
            script.src = link;
        },true);
    };
    const insertCSSFile = (link) => {
        return insertDomToHead('link',function (dom) {
            dom.setAttribute('rel','stylesheet');
            dom.href = link;
        },false);
    };
    const insertDomToBody = (domType,doFn) => {
        let dom = document.createElement(domType);
        doFn(dom);
        document.body.append(dom);
    }
    const insertJSandCSS = (cb,files) => {
        let task = [];
        files.forEach(file => {
            if (file.split('?')[0].endsWith('.js')) {
                task.push(insertJSFile.bind(null,file));
            } else if (file.split('?')[0].endsWith('.css')) {
                task.push(insertCSSFile.bind(null,file));
            }
        })
        function doIt() {
            if (task.length) {
                task.shift()().then(doIt);
            } else {
                setTimeout(cb,200);
            }
        }
        setTimeout(function () {
            doIt();
        });
    }
    let viewer;
    //
    srcPath = srcPath || "../src/MySeal/MarkerAndGraphicManager/";
    const injFiles = [
        "style.css","jquery.min.js","FileSaver.min.js",
        "utils.js","GraphicType.js",
        "Graphic.js","GraphicManager.js",
        "MarkerManager.js","ControlPanel.js"];
    const MarkerAndGraphicManager = {
        MarkManager: null,
        GraphicManager: null,
    };
    // 颜色参考 https://cesium.com/docs/cesiumjs-ref-doc/Color.html?classFilter=color
    // color 表示闪烁时的颜色
    // times 表示闪烁次数
    // obj 是对象
    const flash = {
        defaultColor: Cesium.Color.DEEPSKYBLUE,
        polygon(obj,times,color) {
            if (obj.id._flash) {
                console.log("block");
                return;
            }
            times = times || 3;
            times = times * 2 + 1;
            obj.id._flash = true;
            color = color || flash.defaultColor;
            let tmpColor = [obj.id.polygon.material.color._value,color];
            obj.id.polygon.material = tmpColor[1];
            let id = setInterval(() => {
                times--;
                obj.id.polygon.material.color = tmpColor[times % 2];
                if (!times) {
                    obj.id._flash = false;
                    clearInterval(id);
                }
            },200);
        },
        polyline(obj,times,color) {
            if (obj.id._flash) {
                console.log("block");
                return;
            }
            times = times || 3;
            times = times * 2 + 1;
            obj.id._flash = true;
            color = color || flash.defaultColor;
            let tmpColor = [obj.id.polyline.material.color._value,color];
            obj.id.polyline.material = tmpColor[1];
            let id = setInterval(() => {
                times--;
                obj.id.polyline.material = tmpColor[times % 2];
                if (!times) {
                    obj.id._flash = false;
                    clearInterval(id);
                }
            },600); // flash 特别卡顿
        }
    };
    let init = function(cb,_viewer) {
        viewer = _viewer;
        init = () => {};
        insertJSandCSS(function () {
            MarkerAndGraphicManager.MarkManager = new MarkerManager(viewer);
            MarkerAndGraphicManager.GraphicManager = new GraphicManager(viewer);
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("POLYGON",function ($markerManager,obj) {
                window._click_polygon = obj;
                MarkerAndGraphicManager.GraphicManager.get(obj.id.gvid);
                if (obj.id.properties.__flash_._value === 1) {
                    flash.polyline(obj,3,obj.id.properties.__flash_color_._value);
                }
            });
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("POLYLINE",function ($markerManager,obj) {
                window._click_polyline = obj;
                MarkerAndGraphicManager.GraphicManager.get(obj.id.gvid);
                if (obj.id.properties.__flash_._value === 1) {
                    flash.polyline(obj,3,obj.id.properties.__flash_color_._value);
                }
            });
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("MARKERADD",function ($markerManager,obj) {
                window._click_marker = obj;
                console.log(obj);
            });
            cb();
            panel = new MarkerControlPanel({},MarkerAndGraphicManager).init(viewer).show();
        },injFiles.map(_ => srcPath + _));
    }

    return {
        init(cb,viewer) {
            init(cb,viewer);
            return this;
        },
        panel() {
            return panel;
        },
        getManager() {
            return MarkerAndGraphicManager;
        },
        flash() {
            return flash;
        },
        // 添加 marker 標記
        addMarker(p,{description,text},cb) {
            MarkerAndGraphicManager.MarkManager.addCustomMarker(p,{description,text},cb);
        },
        // 添加 pop
        addPopPanel(p,infos) {
            MarkerAndGraphicManager.MarkManager.createCustomPopPanel(CVT.pixel2Cartesian(p,viewer),infos);
        },
        // geoserver 服务的 geojson
        // defaultColor = "rgba(x,x,x,x)"
        // flashColor = "rgba(x,x,x,x)"
        addOWS(url,type,flash,defaultColor,flashColor) {
            type = type || "line";
            // 默认为 true
            flash = flash ? true : (typeof flash === "boolean" ? false : true);
            flashColor = flashColor || "rgb(0, 191, 255)";
            let tar = type === "line" ? "_polyline" : "_polygon";
            let addFn = () => {};
            let defaultStyle = {};
            if (type === "geojson") {
                addFn = MarkerAndGraphicManager.GraphicManager.addPolygon.bind(MarkerAndGraphicManager.GraphicManager);
                defaultStyle = {};
            } else if (type === "line") {
                addFn = MarkerAndGraphicManager.GraphicManager.addPolyline.bind(MarkerAndGraphicManager.GraphicManager);
                defaultStyle = {
                    clampToGround: true,
                    material: Cesium.Color.fromCssColorString(defaultColor),
                    width: 3
                };
            }
            Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
                dataSource.entities.values.forEach(function (entity,id) {
                    let ps = [];
                    entity[tar].positions._value.forEach(p => ps.push(CVT.cartesian2Wgs84(p,viewer)));
                    let pro = {};
                    dataSource.entities.values[0]._properties.propertyNames.forEach(ns => {
                        pro[ns] = dataSource.entities.values[0]._properties[ns]._value;
                    });
                    if (flash) {
                        pro['_flash_'] = 1;
                        pro['_flash_color_'] = Cesium.Color.fromCssColorString(flashColor);
                    } else {
                        pro['_flash_'] = 0;
                    }
                    pro = {
                        properties: pro,
                        defaultStyle
                    };
                    addFn(ps,
                        "name" in pro ? pro.name : "name_" + id,
                        pro)
                });
            });
        }
    }
}
