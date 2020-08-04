const BaseMapGroupManagerClass = (function() {
    let baseMapOptioin = {
        geocoder: false,  // 隐藏查找位置工具
        homeButton:false, // 隐藏视角返回初始位置
        sceneModePicker:false, //隐藏选择视角的模式
        baseLayerPicker:false, //隐藏图层选择器
        fullscreenButton:true,//隐藏全屏按钮
        navigationHelpButton:false, //隐藏帮助按钮
        selectionIndicator: false,
        infoBox: false,
    };
    let tarLayer = {
        base: 'base',
        option: 'option',
    };
    return class {
        // 这里是静态变量，可以简化调用代码
        static tarLayer = tarLayer
        // 构造器
        constructor(parentDom, viewerId,option) {
            this.parentDom = parentDom;
            this._initDom();
            let $this = this;
            viewerId = viewerId || "map_viewerId";
            this.option = Object.assign(baseMapOptioin,(option || {}));
            this.defaultBaseLayerSetted = false;
            this.firstName = "";
            this.selectLayer = null;
            this.NoBing = false;
            this.defaultBingMapName = "Bing Maps Aerial";

            // todo 不知道为什么总是 不定时会报错
            this.viewer = new Cesium.Viewer(viewerId, this.option);
            this.imageryLayers = this.viewer.imageryLayers;
            this.viewModel = {
                layers: [],
                baseLayers: [],
                upLayer: null,
                downLayer: null,
                selectedLayer: null,
                isSelectableLayer: function (layer) {
                    return this.baseLayers.indexOf(layer) >= 0;
                },
                raise: function (layer, index) {
                    $this.imageryLayers.raise(layer);
                    $this.viewModel.upLayer = layer;
                    $this.viewModel.downLayer = $this.viewModel.layers[Math.max(0, index - 1)];
                    $this._updateLayerList();
                    window.setTimeout(function () {
                        $this.viewModel.upLayer = $this.viewModel.downLayer = null;
                    }, 10);
                },
                lower: function (layer, index) {
                    $this.imageryLayers.lower(layer);
                    $this.viewModel.upLayer =
                        $this.viewModel.layers[
                            Math.min($this.viewModel.layers.length - 1, index + 1)
                            ];
                    $this.viewModel.downLayer = layer;
                    $this._updateLayerList();
                    window.setTimeout(function () {
                        $this.viewModel.upLayer = $this.viewModel.downLayer = null;
                    }, 10);
                },
                canRaise: function (layerIndex) {
                    return layerIndex > 0;
                },
                canLower: function (layerIndex) {
                    return layerIndex >= 0 && layerIndex < $this.imageryLayers.length - 1;
                },
            };
            this.baseLayers = this.viewModel.baseLayers;
            Cesium.knockout.track(this.viewModel);
            this.toolbar = document.getElementById("toolbar");
        }

        // 初始化 dom 节点，这里可以进行无限初始化，就是可以将页面清空重新渲染 地图
        _initDom() {
            this.parentDom.innerHTML = `<div id="cesiumContainer" class="fullSize"><div></div></div>
    <div id="loadingOverlay"><h1>Loading...</h1></div>
    <div id="toolbar" class="_map_toolbar_">
        <table>
            <tbody data-bind="foreach: layers">
            <tr data-bind="css: { up: $parent.upLayer === $data, down: $parent.downLayer === $data }">
                <td><input type="checkbox" data-bind="checked: show"></td>
                <td>
                    <span data-bind="text: name, visible: !$parent.isSelectableLayer($data)"></span>
                    <select data-bind="visible: $parent.isSelectableLayer($data), options: $parent.baseLayers, optionsText: 'name', value: $parent.selectedLayer"></select>
                </td>
                <td>
                    <input type="range" min="0" max="1" step="0.01" data-bind="value: alpha, valueUpdate: 'input'">
                </td>
                <td>
                    <button type="button" class="cesium-button" data-bind="click: function() { $parent.raise($data, $index()); }, visible: $parent.canRaise($index())">
                        ▲
                    </button>
                </td>
                <td>
                    <button type="button" class="cesium-button" data-bind="click: function() { $parent.lower($data, $index()); }, visible: $parent.canLower($index())">
                        ▼
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>`;
        }
        // 添加底图，请结合 addWMS 和 addXYZ 方法
        addBaseLayerOption(name, imageryProvider) {
            let $this = this;
            var layer;
            if (!this.firstName)
                this.firstName = name;
            if (typeof imageryProvider === "undefined") {
                this._setDefaultBaseLayer(name);
            } else {
                layer = new Cesium.ImageryLayer(imageryProvider);
                this.viewModel.selectedLayer = layer;
                layer.name = name;
                this.baseLayers.push(layer);
            }
            return this;
        }

        // 添加可选图层，请结合 addWMS 和 addXYZ 方法
        addAdditionalLayerOption(name, imageryProvider, alpha, show) {
            var layer = this.imageryLayers.addImageryProvider(imageryProvider);
            layer.alpha = Cesium.defaultValue(alpha, 0.5);
            layer.show = Cesium.defaultValue(show, true);
            layer.name = name;
            Cesium.knockout.track(layer, ["alpha", "show", "name"]);
        }

        // 添加 必应底图 并作为默认底图
        addBingAsDefault(bingName) {
            this.defaultBingMapName = bingName || this.defaultBingMapName;
            return this.addXYZ(tarLayer.base, bingName || this.defaultBingMapName, undefined);
        }
        // 不要必应底图
        noBing(bingName) {
            this.NoBing = true;
            this.defaultBingMapName = bingName || this.defaultBingMapName;
            return this.addBingAsDefault();
        }
        // tar = 'base','option'
        addWMS(tar, name, url, layers, parameters, alpha, show) {
            if (tar === tarLayer.base) {
                this.addBaseLayerOption(name, new Cesium.WebMapServiceImageryProvider({
                    enablePickFeatures: false,
                    url: url,
                    layers: layers,
                    parameters
                }));
            } else if (tar === tarLayer.option) {
                this.addAdditionalLayerOption(name, new Cesium.WebMapServiceImageryProvider({
                    enablePickFeatures: false,
                    url: url,
                    layers: layers,
                    parameters
                }), alpha, show);
            }
            return this;
        }

        // tar = 'base','option'
        addXYZ(tar, name, url, alpha, show) {
            if (tar === tarLayer.base) {
                if (typeof url === 'undefined') {
                    this.defaultBingMapName = name;
                    this.addBaseLayerOption(name, url);
                } else {
                    this.addBaseLayerOption(name, new Cesium.UrlTemplateImageryProvider({
                        UrlTemplateImageryProvider: false,
                        url: url
                    }));
                }
            } else if (tar === tarLayer.option) {
                this.addBaseLayerOption(name, new Cesium.UrlTemplateImageryProvider({
                    UrlTemplateImageryProvider: false,
                    url: url
                }), alpha, show);
            }
            return this;
        }

        // 设置默认显示的 底图 ，name 是底图的名字，参考 addWMS、addXYZ、addBaseLayerOption 中的 name
        setDefaultBaseLayer(name) {
            // 如果设置的和默认的一样的，就不管他
            if (this.selectLayer.name === name) {
                return;
            } else {
                let lay = null;
                var numLayers = this.baseLayers.length;
                for (var i = 0; i < numLayers; ++i) {
                    if (this.baseLayers[i].name === name) {
                        lay = this.baseLayers[i];
                        break;
                    }
                }
                if (lay) {
                    this.viewModel.selectedLayer = lay;
                    this._onchange(lay);
                }
            }
        }
        // 内部方法，用于初始化选中的图层（如果想调用来初始化图层，请在调用末尾调用 setDefaultBaseLayer）
        _setDefaultBaseLayer(name) {
            if (!this.defaultBaseLayerSetted) {
                this.defaultBaseLayerSetted = true;
                let layer = this.imageryLayers.get(0);
                console.log(layer);
                this.viewModel.selectedLayer = layer;
                layer.name = name;
                this.baseLayers.push(layer);
                this.selectLayer = layer;
            }
            return this;
        }
        // 内部方法不要管
        _updateLayerList() {
            var numLayers = this.imageryLayers.length;
            this.viewModel.layers.splice(0, this.viewModel.layers.length);
            for (var i = numLayers - 1; i >= 0; --i) {
                this.viewModel.layers.push(this.imageryLayers.get(i));
            }
        }
        // 当下拉框选中另一个图层时
        _onchange(baseLayer) {
            // Handle changes to the drop-down base layer selector.
            var activeLayerIndex = 0;
            var numLayers = this.viewModel.layers.length;
            for (var i = 0; i < numLayers; ++i) {
                if (this.viewModel.isSelectableLayer(this.viewModel.layers[i])) {
                    activeLayerIndex = i;
                    break;
                }
            }
            var activeLayer = this.viewModel.layers[activeLayerIndex];
            var show = activeLayer.show;
            var alpha = activeLayer.alpha;
            this.imageryLayers.remove(activeLayer, false);
            this.imageryLayers.add(baseLayer, numLayers - activeLayerIndex - 1);
            baseLayer.show = show;
            baseLayer.alpha = alpha;
            this.selectLayer = baseLayer;
            this._updateLayerList();
        }

        // 最后调用这个函数完成渲染
        apply(name) {
            this._setDefaultBaseLayer(this.firstName);
            this._updateLayerList();
            let $this = this;
            (() => {
                let map = {};
                let removeInd = [];
                this.viewModel.baseLayers.forEach((lay,ind) => {
                    if (lay.name in map) {
                        removeInd.push(map[lay.name]);
                        map[lay.name] = ind;
                    } else {
                        map[lay.name] = ind;
                    }
                });
                removeInd.reverse().forEach(rid => {
                    this.viewModel.baseLayers.splice(rid,1);
                });
                console.log(`移除重复的底图${JSON.stringify(removeInd)}`);
            })();
            if (name) {
                this.setDefaultBaseLayer(name);
            }
            Cesium.knockout.applyBindings(this.viewModel, this.toolbar);
            Cesium.knockout
                .getObservable(this.viewModel, "selectedLayer")
                .subscribe(this._onchange.bind(this));
            if (this.NoBing) {
                let bingInd = -1;
                this.viewModel.baseLayers.forEach((lay,ind) => {
                    if (lay.name === this.defaultBingMapName) {
                        bingInd = ind;
                    }
                });
                if (bingInd != -1) {
                    this.viewModel.baseLayers.splice(bingInd,1);
                }
            }
            return this;
        }
    }
})();

/**
 * @param parentDom 挂地图的节点，必须事先设置好大小位置
 * @param id        地图的id，如果没有将随机定义一个
 * */
function MyDefault_BaseMapGroupManager_Setting(parentDom, id) {
    // 从 leaflet 项目复制过来的，懒得修改了
    const overlap = {
        "基础要素": {
            "铁路": {
                type: 'wms',
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
                params: {
                    "format": "image/png",
                    "VERSION": "1.1.1",
                    "layers": "ditu:ca2_rail",
                    "transparent": true
                }
            },
            "湖泊": {
                type: 'wms',
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
                params: {
                    "format": "image/png",
                    "VERSION": "1.1.1",
                    "layers": "ditu:ca0_outln",
                    "transparent": true
                }
            },
            "国界": {
                type: 'wms',
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
                params: {
                    "format": "image/png",
                    "VERSION": "1.1.1",
                    "layers": "ditu:ca1_bougj_ln",
                    "transparent": true
                }
            },
            "州界": {
                type: 'wms',
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
                params: {
                    "format": "image/png",
                    "VERSION": "1.1.1",
                    "layers": "ditu:ca1_bouzj_ln",
                    "transparent": true
                }
            },
            "大湖区边界": {
                type: 'wms',
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
                url: `http://10.10.1.132:8080/geoserver/ditu/wms`,
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
    let BaseMapGroupManager = (function () {
        return new BaseMapGroupManagerClass(parentDom, id)
        // .addXYZ(BaseMapGroupManagerClass.tarLayer.base, "Bing Maps Aerial", undefined)
        // .addBingAsDefault() // 与上一句同一个道理
            .noBing()
        .addXYZ(
            BaseMapGroupManagerClass.tarLayer.base,
            'Google',
            'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga'
        ).addWMS(
            BaseMapGroupManagerClass.tarLayer.base,
            "中亚无云遥感TM 30m",
            'http://10.10.1.132:8080/geoserver/ditu/wms',
            `ditu:google3857`, {
                service: 'WMS',
                transparent: true,
            }
        );
    })();
    for (let i in overlap) {
        for (j in overlap[i]) {
            BaseMapGroupManager.addWMS(
                BaseMapGroupManagerClass.tarLayer.option,
                j,
                overlap[i][j].url,
                overlap[i][j].params.layers,
                overlap[i][j].params, 1, false
            )
        }
    }
    BaseMapGroupManager.apply("中亚无云遥感TM 30m");

    return BaseMapGroupManager;
}