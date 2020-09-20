const insertDomToHead = (iframe,domType,doFn,onload) => {
    return new Promise(function (s) {
        let dom = iframe.contentDocument.createElement(domType);
        doFn(dom);
        iframe.contentDocument.head.append(dom);
        if (onload) {
            dom.onload = function () {
                s();
            }
        } else {
            s();
        }
    })
}
const insertJSFile = (iframe,link) => {
    return insertDomToHead(iframe,'script',function (script) {
        script.src = link;
    },true);
};
const insertCSSFile = (iframe,link) => {
    return insertDomToHead(iframe,'link',function (dom) {
        dom.setAttribute('rel','stylesheet');
        dom.href = link;
    },false);
};
const insertDomToBody = (iframe,domType,doFn) => {
    let dom = iframe.contentDocument.createElement(domType);
    doFn(dom);
    iframe.contentDocument.body.append(dom);
}
const insertJSandCSS = (ifr,cb,files) => {
    let task = [];
    files.forEach(file => {
        if (file.split('?')[0].endsWith('.js')) {
            task.push(insertJSFile.bind(null,ifr,file));
        } else if (file.split('?')[0].endsWith('.css')) {
            task.push(insertCSSFile.bind(null,ifr,file));
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
// 如果 id 是 window 表示不使用 iframe 而是使用当前页面
const ifrInstance = function (id,action,{center,level}) {
    center = center || {lat: 45,lng:65};
    level = level || 5;
    let iframe = null;
    // eslint-disable-next-line no-unused-vars
    let mapId = null;
    let myMap = "myMap";
    let mapGroup = "mapGroupInstance";
    let showOneLayerInstance = "showOneLayerInstance";
    let getRasterInfo = "getRasterInfoInstance"
    let addListener = function(parent) {
        addListener = () => {};
        if (parent) {
            window.addEventListener('message', function (event) {
                if (typeof event.data === 'string' && event.data.startsWith("_map_")) {
                    action(JSON.parse(event.data.substring(5)));
                }
            });
        } else {
            // nothing
        }
    }
    // todo 修改 action
    // eslint-disable-next-line no-console
    action = action || console.log;
    if (id === window) {
        iframe = {
            contentWindow: window,
            contentDocument: document,
        };
    } else if (id) {
        iframe = document.getElementById(id);
    } else {
        iframe = document.getElementsByTagName('iframe')[0];
    }
    return {
        myMap() {
            return myMap;
        },
        getMap() {
            return iframe.contentWindow[myMap];
        },
        // 完成最为基础的 js 和 css 注入
        // otherFile = ['脚本地址.js','脚本地址.css']
        initFrameBase(cb,otherFile) {
            if (iframe.contentWindow !== window) {
                iframe.contentWindow.location.reload();
                // target 例如 marker、map、drawer
// type 例如 click、move、hover
                window.$emit = function(msg,target,type,others) {
                    others = others || {};
                    window.postMessage("_map_" + JSON.stringify({
                        data:msg,
                        target,
                        type,
                        ...others
                    }), '*');
                }
            } else {
                // target 例如 marker、map、drawer
// type 例如 click、move、hover
                window.$emit = function(msg,target,type,others) {
                    others = others || {};
                    action({
                        data:msg,
                        target,
                        type,
                        ...others
                    });
                }
            }
            let files = ["/leaflet1.6/plugin/defaultAction.js",
                "/leaflet1.6/leaflet.js","/leaflet1.6/plugin/ibasGroup/group.js",
                "/leaflet1.6/plugin/ibasGroup/group.js",
                "/leaflet1.6/plugin/ibasGroup/initGroup.js",
                "/leaflet1.6/plugin/Utils/ShowOneLayer.js",
                "/leaflet1.6/plugin/getInfo/GetRasterInfo.js",
                "/leaflet1.6/leaflet.css","/leaflet1.6/plugin/ibasGroup/group.css",
            ].map(_ => (window.relativePath || "") + _).concat(otherFile || []);
            setTimeout(function () {
                insertJSandCSS(iframe,cb,files);
                iframe.contentDocument.body.style.margin = "0";
                iframe.contentDocument.body.style.padding = "0";
                iframe.contentDocument.body.style.border = "none";
            });
            addListener(iframe.contentWindow !== window);
        },
        // 向 body 插入 dom 元素
        insertDomToBody(domType,doFn) {
            insertDomToBody(iframe,domType,doFn);
        },
        // 插入 js 和 css 文件
        insertJSandCSS(cb,files) {
            insertJSandCSS(iframe,cb,files);
        },
        // 直接注入 js 代码
        eval(jsCode) {
            iframe.contentWindow.eval(jsCode);
        },
        // 初始化地图，包括初始化底图管理
        initMapDom(_mapId) {
            mapId = _mapId || "map";
            this.insertDomToBody('div',function (dom) {
                dom.id = _mapId;
                dom.style.width = "100vw";
                dom.style.height = "100vh";
            });
            this.eval(`window.${myMap} = L.map('${_mapId}',{doubleClickZoom: false}).setView([${center.lat},${center.lng}], ${level});
            window.${mapGroup} = manageMapGroupInstance(buildLayerControl(${myMap}));`);
            this.eval(`window.${showOneLayerInstance} = ShowOneLayer().init(window.${myMap})`);
            this.eval(`window.${getRasterInfo} = getRasterInfo().init(window.${myMap})`);
            this.eval(`window.${myMap}.on('click',function(ret) {
                window.$emit({latlng:ret.latlng,layerPoint:ret.layerPoint,containerPoint:ret.containerPoint},'map','click');
            });`);
        },
        // todo 需要从核心中分离
        // 对地图的管理
        managerMapGroup(action,tar) {
            if (action === "open") {
                this.eval(`window.${mapGroup}.${action}(${JSON.stringify(tar)})`)
            } else if (action === "switch") {
                this.eval(`window.${mapGroup}.${action}(${JSON.stringify(tar)})`)
            }
        },
        // 在地图右下角显示图例
        showLegend(imgSrc) {
            this.eval(`addLegend(${myMap},'${imgSrc}')`)
        },
        // 显示一层图层
        showOneLayer(url,param) {
            this.eval(`window.${showOneLayerInstance}.showLayer('${url}','${JSON.stringify(param)}')`);
        },
        // todo 需要改成订制版本，例如 干旱指数、蒸散发等
        // 显示栅格点击获取的信息
        addMapOnClickToShowInfo(url,layerName,e) {
            this.eval(`window.${getRasterInfo}.getPointInfo('${url}','${layerName}','${JSON.stringify(e)}')`);
        },
        testRun(code,suc,fail) {
            let runIt = suc;
            try {
                iframe.contentWindow.eval(code)
            } catch (e) {
                runIt = fail;
            } finally {
                runIt();
            }
        }
    }
}