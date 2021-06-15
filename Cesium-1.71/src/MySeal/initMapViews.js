/**
 * 初始化包括以下内容
 * 加入 vue.js、iview.js、cesium.js
 * @param path   相关 js 相对于当前页面的路径
 * @param cb     全部事件执行后执行该回调
 * @param ejs    额外添加的 js 文件数组 （全路径）
 * @param ecss   额外添加的 css 文件数组（全路径）
 * @param config 配置
 * @param CesiumCorePath ['./pathto/Cesium.js','./pathto/Cesium/Wedgets/widgets.css']
 * */
// _eChartConfig = false / {bar} / all
// noMap,noMarkerAndGraphicManager,offset,_eChartConfig
function initMapViews(path,cb,ejs,ecss,config,libPath,CesiumCorePath,initOver) {
    const {
        noMap, // true or false 是否加载地图相关的脚本，如果位false将无法加载地图
        noMarkerAndGraphicManager, // true or false 如果位false将不加载 marker 和 graphic 相关的脚本
        offset, // {x:0,y:0} 表示 整个 dom 的偏移（tip 部分随鼠标移动时显示的位置）
        _eChartConfig, // false -> 不需要 / ['bar'] -> 加载其中的 bar 封装方法 / all -> 加载所有封装方法
    } = Object.assign({
        noMap: false,
        noMarkerAndGraphicManager: false,
        offset: {x:0,y:0},
        _eChartConfig: "all"
    },(config ? config : {}));
    if (typeof libPath !== 'string') libPath = "lib/";
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
    const eChartConfig = (function (cf) {
        let cjs = [];
        let extension = {
            bar: 'echartSeal/Bar.js',
            RangeLine: 'echartSeal/RangeLine.js',
            SimpleMultiLine: 'echartSeal/SimpleMultiLine.js',
            SanKey: 'echartSeal/SanKey.js',
            ZoomBar: 'echartSeal/ZoomBar.js',
            AnyEchart: 'echartSeal/AnyEchart.js'
        };
        if (!cf) {
            return cjs;
        } else {
            cjs.push('echart/echarts.js');
            cjs.push('echartSeal/Css3Renderer.js');
            if (typeof cf === "string") {
                if (cf === "all") {
                    for (let i in extension) {
                        cjs.push(extension[i]);
                    }
                } else {
                    console.warn(`_eChartConfig = ${cf} 设置无效`);
                }
            } else if (cf instanceof Array) {
                cf.forEach(i => {
                    if (i in extension) {
                        cjs.push(extension[i]);
                    }
                });
            }
        }
        return cjs.map(_ => path + libPath + _);
    })(_eChartConfig);

    // if (window.parent !== window) {
    //     window.loading = window.parent.loading;
    //     loading.load("正在加载文件");
    // } else {
    //     window.loading = () => {};
    // }
    // 全部位置都是基于 dist
    const injFiles = [
        ...(noMap ? [] : CesiumCorePath || [
            libPath + 'Cesium/Widgets/widgets.css',
            libPath + 'Cesium/Cesium.js',
        ].map(_ => path + _)), // map core
        ...[
            // libPath + 'index/Css3Rnederer.css',
            // 'dist/index/styles.css',
            // 'dist/iview/iview.css',
        ].map(_ => path + _), // css
        ...(ecss || []),
        ...(noMap ? [] : [
            libPath + 'setBaseView.js',
            libPath + 'TimeLine.js',
            libPath + 'utils.js',
            libPath + 'mapHandle.js',
            ...(noMarkerAndGraphicManager ? [] : [
                "style.css","jquery.min.js","FileSaver.min.js",
                "utils.js","GraphicType.js","PickFeature.js",
                "Graphic.js","GraphicManager.js","AddFeatureOrOWS.js",
                "MarkerManager.js","MarkerControlPanel.js"
            ].map(_ => libPath + "MarkerAndGraphicManager/" + _)),
        ]).map(_ => path + _), // map js
        ...[
            // libPath + 'index/base.js',
            // 'dist/iview/vue.min.js',
            // 'dist/iview/iview.min.js'
        ].map(_ => path + _), // js
        ...eChartConfig, // echart js
        ...(ejs || []),
    ];

    let addPopPanel = function(p,infos) {
        MarkerAndGraphicManager.MarkManager.createSelfControlPopDom(CVT.pixel2Cartesian(p,viewer),infos);
    }
    window.MarkerAndGraphicManager = {
        MarkManager: null,
        GraphicManager: null,
        addFeatureOrOWS: null,
        panel: null,
        // 较为常用的功能二次封装
        usual: {
            // 添加 marker 標記
            addMarker(p,{description,text,info},cb) {
                MarkerAndGraphicManager.MarkManager.addCustomMarker(p,{description,text,info},cb);
            },
            initVectorPickFeature(layerProvider,showFn,showPopFn) {
                if (typeof showFn === "string" && showFn in PickFeature.defaultShowPop) {
                    showFn = PickFeature.defaultShowPop[showFn].bind(null,addPopPanel);
                }
                pickFeature.showPop = showPopFn || function (c2,datas) {
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
            },
            initRasterPickFeature(layerProvider,showFn) {
                if (typeof showFn === "string" && showFn in PickFeature.defaultShowPop) {
                    showFn = PickFeature.defaultShowPop[showFn].bind(null,addPopPanel);
                } else if (typeof showFn === "function") {
                    showFn = showFn.bind(null,addPopPanel);
                }
                pickFeature.showPop = showFn;
                pickFeature.provider = layerProvider;
                // pickFeature
                handler.lclick(function (p) {
                    if (window.pickFeatureLockFn.check()) {
                        return;
                    }
                    pickFeature.query(p.src);
                });
            },
            // type = 'polygon' | 'polyline', style 参考 Graphic 中 defaultStyle 的定义
            setPanelDefaultStyle(type,style) {
                type = type.toString().toLowerCase();
                let types = {
                    polyline: 'defaultPolylineStyle',
                    polygon: 'defaultPolygonStyle'
                }
                if (type in types) {
                    window.MarkerAndGraphicManager.panel[types[type]] = style;
                }
            }
        }
    };
    window.pickFeature = null;
    window.addFeatureOrOWS = null;
    window.pickFeatureLockFn = new class {
        constructor() {
            this.fns = [() => false];
        }
        addFn(fn) {
            if (typeof fn === 'function') {
                this.fns.push(fn);
            }
            return this;
        }
        // 返回 true 表示锁🔒
        check() {
            let lock = false;
            this.fns.forEach(f => {
                lock = lock || f();
            });
            return lock;
        }
    };

    const ret = {
        /**
         *
         * @param viewer
         * @param cb
         * @param panelCallback = {
         *          clearCallback() {} // 清除全部绘制的图形后的回调
         *      }
         */
        initMarkerAndGraphicManager(viewer,cb,panelCallback) {
            if (!noMarkerAndGraphicManager) {
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
                window.MarkerAndGraphicManager.usual.flash = flash;
                MarkerAndGraphicManager.MarkManager = new MarkerManager(viewer,CesiumBillboard.defaultLabelStyle,CesiumBillboard.defaultLabelStyle,CesiumBillboard.defaultLabelStyle,offset);
                MarkerAndGraphicManager.GraphicManager = new GraphicManager(viewer,{},offset);
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
                MarkerAndGraphicManager.panel = new MarkerControlPanel({},MarkerAndGraphicManager,{},panelCallback).init(viewer);
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
                        let lclickMethod = () => {};
                        handler.setInputAction(function(click){
                            let map = viewer.scene.globe.pick(viewer.camera.getPickRay(click.position), viewer.scene);
                            var pick = window.viewer.scene.pick(click.position);
                            lclickMethod({
                                click,
                                src: click.position,
                                // dom 节点上的位置
                                view: viewer.scene.pick(click.position),
                                word: viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid),
                                platform: viewer.scene.pickPosition(click.position),
                                // 可以绘制到地图的对应位置
                                map: map,
                                // wgs84 的坐标，可以和后台交互
                                wgs84: transformLocation.c3LatLng(map),
                                pick: (Cesium.defined(pick))?pick:null
                            });
                        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

                        return {
                            lclick(cb) {
                                lclickMethod = cb;
                            }
                        }
                    })();
                }
                addFeatureOrOWS = new AddFeatureOrOWS(viewer,MarkerAndGraphicManager.GraphicManager,MarkerAndGraphicManager.MarkManager,flash,{});
                MarkerAndGraphicManager.addFeatureOrOWS = addFeatureOrOWS;
                let $id = setInterval(function () {
                    const p = viewer.scene.globe.pick(viewer.camera.getPickRay({x:parseInt(Math.random() * 100),y:parseInt(Math.random() * 100)}), viewer.scene);
                    if (Cesium.defined(p)) {
                        let lockFn = window.pickFeatureLockFn;
                        window.pickFeatureLockFn.addFn(function() {
                            let draw = false;
                            let mgm = MarkerAndGraphicManager.GraphicManager.mode;
                            if (mgm && mgm === 'create') {
                                draw = true;
                            }
                            let mpm = MarkerAndGraphicManager.panel.mode;
                            if (mpm && mpm === 'create') {
                                MarkerAndGraphicManager.panel.mode = 'ready';
                                draw = true;
                            }
                            return draw;
                        });
                        clearInterval($id);
                        (cb || (() => {}))();
                    }
                },100);
            }
        }
    };
    (function() {
        insertJSandCSS(function () {
            // 结束回调
            // window.loading.close();
            (initOver || (() => {}))();
            cb(ret);
        },injFiles);
    })();
    return ret
}