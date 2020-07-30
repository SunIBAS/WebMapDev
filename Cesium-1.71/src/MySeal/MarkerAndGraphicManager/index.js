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
    const injFiles = ["style.css","jquery.min.js","utils.js","GraphicType.js","Graphic.js","GraphicManager.js","MarkerManager.js"];
    const MarkerAndGraphicManager = {
        MarkManager: null,
        GraphicManager: null,
    };
    const flash = {
        polygon(obj,times,color) {
            if (obj.id._flash) {
                console.log("block");
                return;
            }
            obj.id._flash = true;
            color = color || Cesium.Color.DEEPSKYBLUE;
            let tmpColor = [obj.id.polygon.material.color,Cesium.Color.DEEPSKYBLUE];
            obj.id.polygon.material = tmpColor[1];
            times = times || 3;
            times = times * 2 + 1;
            let id = setInterval(() => {
                times--;
                obj.id.polygon.material.color = tmpColor[times % 2];
                if (!times) {
                    obj.id._flash = false;
                    clearInterval(id);
                }
            },200);
        }
    };
    let init = function(cb,_viewer) {
        viewer = _viewer;
        init = () => {};
        insertJSandCSS(function () {
            MarkerAndGraphicManager.MarkManager = new MarkerManager(viewer);
            MarkerAndGraphicManager.GraphicManager = new GraphicManager(viewer);
            MarkerAndGraphicManager.MarkManager.addDearObjMethod("POLYGON",function ($markerManager,obj) {
                MarkerAndGraphicManager.GraphicManager.get(obj.id.gvid);
                flash.polygon(obj,3);
            });
            cb();
        },injFiles.map(_ => srcPath + _));
    }
    return {
        init(cb,viewer) {
            init(cb,viewer);
            return this;
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
        }
    }
}
