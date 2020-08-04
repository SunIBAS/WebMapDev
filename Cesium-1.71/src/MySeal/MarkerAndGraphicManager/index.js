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
        });
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
        "utils.js","GraphicType.js","PickFeature.js",
        "Graphic.js","GraphicManager.js",
        "MarkerManager.js","MarkerControlPanel.js"];
    const MarkerAndGraphicManager = {
        MarkManager: null,
        GraphicManager: null,
    };
    let pickFeature;
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
                if (obj.id.properties && obj.id.properties.__flash_ && obj.id.properties.__flash_._value === 1) {
                    flash.polyline(obj,3,obj.id.properties.__flash_color_._value);
                }
            });
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("POLYLINE",function ($markerManager,obj) {
                window._click_polyline = obj;
                MarkerAndGraphicManager.GraphicManager.get(obj.id.gvid);
                if (obj.id.properties && obj.id.properties.__flash_ && obj.id.properties.__flash_._value === 1) {
                    flash.polyline(obj,3,obj.id.properties.__flash_color_._value);
                }
            });
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("MARKERADD",function ($markerManager,obj) {
                window._click_marker = obj;
                console.log(obj);
            });
            panel = new MarkerControlPanel({},MarkerAndGraphicManager).init(viewer).show();
            pickFeature = new PickFeature(viewer);
            cb();
        },injFiles.map(_ => srcPath + _));
    }


    // 点击事件 todo 这里在 setBaseView 中也定义了，但是懒得改了，后面引用注意即可
    if (!window.handler) {
        window.handler = (function () {
            let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            let lclick = () => {};
            handler.setInputAction(function(click){
                let map = viewer.scene.globe.pick(viewer.camera.getPickRay(click.position), viewer.scene);
                lclick({
                    src: click.position,
                    // dom 节点上的位置
                    view: viewer.scene.pick(click.position),
                    word: viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid),
                    platform: viewer.scene.pickPosition(click.position),
                    // 可以绘制到地图的对应位置
                    map: map,
                    // wgs84 的坐标，可以和后台交互
                    wgs84: transformLocation.c3LatLng(map)
                });
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);

            return {
                lclick(cb) {
                    lclick = cb;
                }
            }
        })();
    }

    let addPopPanel = function(p,infos) {
        MarkerAndGraphicManager.MarkManager.createCustomPopPanel(CVT.pixel2Cartesian(p,viewer),infos);
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
        addPopPanel,
        // geoserver 服务的 geojson
        // defaultColor = "rgba(x,x,x,x)"
        // flashColor = "rgba(x,x,x,x)"
        // type 只能是 line 或 polygon
        // flash 为 true 或 false
        // 两个 color 是 Cesium.Color 对象
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
        },
        initPickFeature(layerProvider,showFn) {
            if (typeof showFn === "string" && showFn in PickFeature.defaultShowPop) {
                showFn = PickFeature.defaultShowPop[showFn].bind(null,addPopPanel);
            }
            pickFeature.showPop = showFn;
            pickFeature.provider = layerProvider;
            // pickFeature
            handler.lclick(function (p) {
                pickFeature.query(p.src);
            });
        }
    }
}
