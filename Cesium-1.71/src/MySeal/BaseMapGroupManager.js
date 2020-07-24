const BaseMapGroupManagerClass = (class {
    constructor(parentDom, viewerId) {
        this.parentDom = parentDom;
        this.initDom();
        this.tar = {
            base: 'base',
            option: 'option',
        };
        let $this = this;
        this.viewer = new Cesium.Viewer(viewerId, {
            baseLayerPicker: false,
        });
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
                $this.updateLayerList();
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
                $this.updateLayerList();
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
        this.defaultBaseLayerSetted = false;
    }

    initDom() {
        this.parentDom.innerHTML = `<div id="cesiumContainer" class="fullSize"></div>
<div id="loadingOverlay"><h1>Loading...</h1></div>
<div id="toolbar">
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

    setDefaultBaseLayer(name) {
        if (!this.defaultBaseLayerSetted) {
            this.defaultBaseLayerSetted = true;
            let layer = this.imageryLayers.get(0);
            console.log(layer);
            this.viewModel.selectedLayer = layer;
            layer.name = name;
            this.baseLayers.push(layer);
        }
    }
    addBaseLayerOption(name, imageryProvider) {
        let $this = this;
        var layer;
        if (typeof imageryProvider === "undefined") {
            this.setDefaultBaseLayer(name);
        } else {
            layer = new Cesium.ImageryLayer(imageryProvider);
            this.viewModel.selectedLayer = layer;
            layer.name = name;
            this.baseLayers.push(layer);
        }
        // setTimeout(this.setDefaultBaseLayer.bind(this));
        return this;
    }

    addAdditionalLayerOption(name, imageryProvider, alpha, show) {
        var layer = this.imageryLayers.addImageryProvider(imageryProvider);
        layer.alpha = Cesium.defaultValue(alpha, 0.5);
        layer.show = Cesium.defaultValue(show, true);
        layer.name = name;
        Cesium.knockout.track(layer, ["alpha", "show", "name"]);
    }

    updateLayerList() {
        var numLayers = this.imageryLayers.length;
        this.viewModel.layers.splice(0, this.viewModel.layers.length);
        for (var i = numLayers - 1; i >= 0; --i) {
            this.viewModel.layers.push(this.imageryLayers.get(i));
        }
    }

    // tar = 'base','option'
    addWMS(tar, name, url, layers, parameters, alpha, show) {
        if (tar === this.tar.base) {
            this.addBaseLayerOption(name, new Cesium.WebMapServiceImageryProvider({
                url: url,
                layers: layers,
                parameters
            }));
        } else if (tar === this.tar.option) {
            this.addAdditionalLayerOption(name, new Cesium.WebMapServiceImageryProvider({
                url: url,
                layers: layers,
                parameters
            }), alpha, show);
        }
        return this;
    }

    // tar = 'base','option'
    addXYZ(tar, name, url, alpha, show) {
        if (tar === this.tar.base) {
            if (typeof url === 'undefined') {
                this.addBaseLayerOption(name, url);
            } else {
                this.addBaseLayerOption(name, new Cesium.UrlTemplateImageryProvider({
                    url: url
                }));
            }
        } else if (tar === this.tar.option) {
            this.addBaseLayerOption(name, new Cesium.UrlTemplateImageryProvider({
                url: url
            }), alpha, show);
        }
        return this;
    }

    apply() {
        this.updateLayerList();
        let $this = this;
        Cesium.knockout.applyBindings(this.viewModel, this.toolbar);
        Cesium.knockout
            .getObservable(this.viewModel, "selectedLayer")
            .subscribe(function (baseLayer) {
                // Handle changes to the drop-down base layer selector.
                var activeLayerIndex = 0;
                var numLayers = $this.viewModel.layers.length;
                for (var i = 0; i < numLayers; ++i) {
                    if ($this.viewModel.isSelectableLayer($this.viewModel.layers[i])) {
                        activeLayerIndex = i;
                        break;
                    }
                }
                var activeLayer = $this.viewModel.layers[activeLayerIndex];
                var show = activeLayer.show;
                var alpha = activeLayer.alpha;
                $this.imageryLayers.remove(activeLayer, false);
                $this.imageryLayers.add(baseLayer, numLayers - activeLayerIndex - 1);
                baseLayer.show = show;
                baseLayer.alpha = alpha;
                $this.updateLayerList();
            });
        return this;
    }

});

function MyDefault_BaseMapGroupManager_Setting(parentDom, id) {
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
    BaseMapGroupManager = new BaseMapGroupManagerClass(parentDom, id)
    BaseMapGroupManager
        .addXYZ(BaseMapGroupManager.tar.base, "Bing Maps Aerial", undefined)
        .addXYZ(
            BaseMapGroupManager.tar.base,
            'Google',
            'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga'
        ).addWMS(
            BaseMapGroupManager.tar.base,
            "中亚无云遥感TM 30m",
            'http://10.10.1.132:8080/geoserver/ditu/wms',
            `ditu:google3857`, {
                service: 'WMS',
                transparent: true,
            }
        )
    for (let i in overlap) {
        for (j in overlap[i]) {
            BaseMapGroupManager.addWMS(
                BaseMapGroupManager.tar.option,
                j,
                overlap[i][j].url,
                overlap[i][j].params.layers,
                overlap[i][j].params, 1, false
            )
        }
    }
    BaseMapGroupManager.apply();

    return BaseMapGroupManager;
}