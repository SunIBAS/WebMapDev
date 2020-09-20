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
        "Graphic.js","GraphicManager.js","AddFeatureOrOWS.js",
        "MarkerManager.js","MarkerControlPanel.js"];
    const MarkerAndGraphicManager = {
        MarkManager: null,
        GraphicManager: null,
        addFeatureOrOWS: null,
    };
    let pickFeature;
    let addFeatureOrOWS = null;
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
            let tmpColor = [obj.id.polygon.material,color];
            obj.id.polygon.material = tmpColor[1];
            let id = setInterval(() => {
                times--;
                obj.id.polygon.material = tmpColor[times % 2];
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
                if (obj.id.properties && obj.id.properties.__flash_ && obj.id.properties.__flash_._value === 1) {
                    flash.polyline(obj,3,obj.id.properties.__flash_color_._value);
                }
            });
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("POLYLINE",function ($markerManager,obj) {
                window._click_polyline = obj;
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
            // 定义点击事件接口，虽然在 markerManager.js 中定义了一部分
            if (!window.handler) {
                // 坐标投影
                let transformLocation = (function (viewer) {
                    var ellipsoid=viewer.scene.globe.ellipsoid;
                    return {
                        c3LatLng(cartesian3) {
                            var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
                            var lat=Cesium.Math.toDegrees(cartographic.latitude);
                            var lng=Cesium.Math.toDegrees(cartographic.longitude);
                            var alt=cartographic.height;
                            console.log(`lat=${lat},lng=${lng},alt=${alt}`);
                            return {
                                lat,
                                lng,
                                alt,
                                // todo 暂时随便写的
                                x: lat,
                                y: lng
                            }
                        }
                    }
                })(viewer);
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
            addFeatureOrOWS = new AddFeatureOrOWS(viewer,MarkerAndGraphicManager.GraphicManager,MarkerAndGraphicManager.MarkManager,flash,{});
            MarkerAndGraphicManager.addFeatureOrOWS = addFeatureOrOWS;
            cb();
        },injFiles.map(_ => srcPath + _));
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
        // addOWS(url,type,flash,defaultColor,flashColor) {
        //     addFeatureOrOWS.addOWS(url,type,flash,defaultColor,flashColor);
        // },
        initRasterPickFeature(layerProvider,showFn) {
            if (typeof showFn === "string" && showFn in PickFeature.defaultShowPop) {
                showFn = PickFeature.defaultShowPop[showFn].bind(null,addPopPanel);
            }
            pickFeature.showPop = showFn;
            pickFeature.provider = layerProvider;
            // pickFeature
            handler.lclick(function (p) {
                pickFeature.query(p.src);
            });
        },
        initVectorPickFeature(layerProvider,showFn) {
            if (typeof showFn === "string" && showFn in PickFeature.defaultShowPop) {
                showFn = PickFeature.defaultShowPop[showFn].bind(null,addPopPanel);
            }
            pickFeature.showPop = function (c2,datas) {
                addFeatureOrOWS.addPolygonShpGetInfo(datas[0].data,p => {
                    for (let i in p) {
                        if (/^[0-9]*[.]{0,1}[0-9]*$/.test(p[i] + '')) {
                            p[i] = parseFloat(p[i]).toFixed(2);
                        }
                    }
                    return p;
                });
            };
            pickFeature.provider = layerProvider;
            // pickFeature
            handler.lclick(function (p) {
                pickFeature.query(p.src);
            });
        }
    }
}
