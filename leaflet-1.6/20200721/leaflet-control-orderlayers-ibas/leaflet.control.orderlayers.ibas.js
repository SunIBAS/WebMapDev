/* eslint-disable no-mixed-spaces-and-tabs,no-undef */
/*
 * L.Control.OrderLayers is a control to allow users to switch between different layers on the map.
 */

import * as Util from "leaflet/src/core/Util";
import * as DomEvent from "leaflet/src/dom/DomEvent";
import * as DomUtil from "leaflet/src/dom/DomUtil";
import * as Browser from "leaflet/src/core/Browser";

HTMLElement.prototype.clearChild = function () {
    let len = this.childNodes.length - 1;
    for (let i = len;i >= 0;i--) {
        this.removeChild(this.childNodes[i]);
    }
    return this;
};

L.Control.OrderLayersIBAS = L.Control.Layers.extend({
    overlayEleItems: {
        container: null,
        items: {},
        bottom: null,
        top: null
    },

    options: {
        title: 'Layer Manager',
        order: 'normal',
        showBaselayers: true,
        autoZIndex: false,
        collapsed: false,
    },

    // onAdd: function (map) {
    //     this._initLayout();
    //     this._update();
    //
    //     map
    //         .on('layeradd', this._onLayerChange, this)
    //         .on('layerremove', this._onLayerChange, this)
    //         .on('changeorder', this._onLayerChange, this);
    //
    //     return this._container;
    // },
    //
    // onRemove: function (map) {
    //     map
    //         .off('layeradd', this._onLayerChange)
    //         .off('layerremove', this._onLayerChange)
    //         .off('changeorder', this._onLayerChange);
    // },

    _initLayout: function () {
        var className = 'leaflet-control-layers',
            container = this._container = L.DomUtil.create('div', className),
            collapsed = this.options.collapsed;

        //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute('aria-haspopup', true);

        DomEvent.disableClickPropagation(container);
        DomEvent.disableScrollPropagation(container);

        if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
        } else {
            L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
        }

        var form = this._section =  this._form = L.DomUtil.create('form', className + '-list');

        if (collapsed) {
            this._map.on('click', this.collapse, this);

            if (!Browser.android) {
                DomEvent.on(container, {
                    mouseenter: this.expand,
                    mouseleave: this.collapse
                }, this);
            }
        }

        var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
        link.href = '#';
        link.title = 'Layers';

        if (Browser.touch) {
            DomEvent.on(link, 'click', DomEvent.stop);
            DomEvent.on(link, 'click', this.expand, this);
        } else {
            DomEvent.on(link, 'focus', this.expand, this);
        }

        if (!collapsed) {
            this.expand();
        }

        if(this.options.title) {
            var title = L.DomUtil.create('h3', className + '-title');
            title.innerHTML = this.options.title;
            form.appendChild(title);
        }

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(form);
    },

    _update: function () {
        if (!this._container) {
            return;
        }

        DomUtil.empty(this._baseLayersList);
        DomUtil.empty(this._overlaysList);

        var BottomLayer = L.DomUtil.create('div','leaflet-row');
        BottomLayer.innerHTML = '最底层';
        var TopLayer = L.DomUtil.create('div','leaflet-row');
        TopLayer.innerHTML = '最顶层';
        this.overlayEleItems.bottom = BottomLayer;
        this.overlayEleItems.top = TopLayer;

        this._layerControlInputs = [];

        var baseLayersPresent = false,
            overlaysPresent = false,
            i, obj, baseLayersCount = 0;

        var overlaysLayers = [];
        // todo 源码中全部都 _addItem ，不知道这里问什么不这么做
        for (i in this._layers) {
            obj = this._layers[i];
            if(!obj.overlay) {
                this._addItem(obj);
            } else if(obj.layer.options && obj.layer.options.zIndex) {
                overlaysLayers[obj.layer.options.zIndex] = obj;
            } else if(obj.layer.getLayers && obj.layer.eachLayer) {
                var min = 9999999999;
                obj.layer.eachLayer(function(ly) {
                    if(ly.options && ly.options.zIndex) {
                        min = Math.min(ly.options.zIndex, min);
                    }
                });
                overlaysLayers[min] = obj;
            }
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
            baseLayersCount += !obj.overlay ? 1 : 0;
        }

        // Hide base layers section if there's only one layer.
        if (this.options.hideSingleBase) {
            baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
            this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
        }

        this._overlaysList.appendChild(BottomLayer);
        if(this.options.order === 'normal') {
            for(i = 0; i < overlaysLayers.length; i++) {
                if(overlaysLayers[i]) {
                    this._addItem(overlaysLayers[i]);
                }
            }
        } else {
            for(i = overlaysLayers.length-1; i >= 0; i--) {
                if(overlaysLayers[i]) {
                    this._addItem(overlaysLayers[i]);
                }
            }
        }
        this._overlaysList.appendChild(TopLayer);

        this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

        return this;
    },

    _addItem: function (obj) {
        // 和源码对比，这里的 col 相当于源码的 label，而 label 相当于 holder
        var label = L.DomUtil.create('label', ''),
            input,
            checked = this._map.hasLayer(obj.layer);

        if (obj.overlay) {
            input = L.DomUtil.create('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;
        } else {
            input = this._createRadioElement('leaflet-base-layers_' + Util.stamp(this), checked);
        }
        this._layerControlInputs.push(input);

        let layerId = '';
        this._layers.some((layer,ind) => {
            layerId = ind;
            return layer.name === obj.name
        });
        input.targetLayerId = layerId;
        input.layerId = Util.stamp(obj.layer);
        DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;
        label.appendChild(name);

        var row = L.DomUtil.create('div', 'leaflet-row');

        var col = L.DomUtil.create('div', 'leaflet-input');
        col.appendChild(input);
        row.appendChild(col);
        var icon = L.DomUtil.create('label', 'leaflet-icon');
        icon.htmlFor = input.id;
        col = L.DomUtil.create('div', 'leaflet-name');
        label.htmlFor = input.id;

        col.appendChild(icon);
        col.appendChild(label);
        row.appendChild(col);

        var container;
        if(obj.overlay) {
            col = L.DomUtil.create('div', 'leaflet-up');
            L.DomEvent.on(col, 'click', (this.options.order === 'normal'? this._onUpClick:this._onDownClick), this);
            col.targetLayerId = layerId;
            row.appendChild(col);
            col = L.DomUtil.create('div', 'leaflet-down');
            col.targetLayerId = layerId;
            L.DomEvent.on(col, 'click', (this.options.order === 'normal'? this._onDownClick:this._onUpClick), this);
            row.appendChild(col);
            container = this._overlaysList;
            this.overlayEleItems.container = container;
            this.overlayEleItems.items[layerId] = row;
        } else {
            container = this._baseLayersList;
        }
        container.appendChild(row);
        this._checkDisabledLayers();
        return label;
    },

    _onUpClick: function(e) {
        var targetLayerId = e.currentTarget.targetLayerId;
        var inputs = this._form.getElementsByTagName('input');
        var obj = this._layers[targetLayerId];

        if(!obj.overlay) {
            return;
        }

        var replaceLayer = null;
        var idx = this._getZIndex(obj);
        for(var i=0; i < inputs.length; i++) {
            var auxLayer = this._layers[inputs[i].targetLayerId];
            var auxIdx = this._getZIndex(auxLayer);
            if(auxLayer.overlay && (idx - 1) === auxIdx) {
                replaceLayer = auxLayer;
                break;
            }
        }

        var newZIndex = idx - 1;
        if(replaceLayer) {
            obj.layer.setZIndex(newZIndex);
            replaceLayer.layer.setZIndex(newZIndex + 1);
            this._map.fire('changeorder', obj, this);
        }
        this._updateButton();
    },

    _onDownClick: function(e) {
        var targetLayerId = e.currentTarget.targetLayerId;
        var inputs = this._form.getElementsByTagName('input');
        var obj = this._layers[targetLayerId];

        if(!obj.overlay) {
            return;
        }

        var replaceLayer = null;
        var idx = this._getZIndex(obj);
        for(var i=0; i < inputs.length; i++) {
            var auxLayer = this._layers[inputs[i].targetLayerId];
            var auxIdx = this._getZIndex(auxLayer);
            if(auxLayer.overlay && (idx + 1) === auxIdx) {
                replaceLayer = auxLayer;
                break;
            }
        }

        var newZIndex = idx + 1;
        if(replaceLayer) {
            obj.layer.setZIndex(newZIndex);
            replaceLayer.layer.setZIndex(newZIndex - 1);
            this._map.fire('changeorder', obj, this);
        }
        this._updateButton();
    },

    _getZIndex: function(ly) {
        var zindex = 9999999999;
        if(ly.layer.options && ly.layer.options.zIndex) {
            zindex = ly.layer.options.zIndex;
        } else if(ly.layer.getLayers && ly.layer.eachLayer) {
            ly.layer.eachLayer(function(lay) {
                if(lay.options && lay.options.zIndex) {
                    zindex = Math.min(lay.options.zIndex, zindex);
                }
            });
        }
        return zindex;
    },

    _updateButton(){
        var layerZIndex = [];
        for (var i in this._layers) {
            if (this._layers[i].overlay) {
                layerZIndex.push({
                    ind: i,
                    zIndex: this._layers[i].layer.options.zIndex
                })
            }
        }
        layerZIndex.sort((a,b) => {
            return a.zIndex - b.zIndex
        })
        this.overlayEleItems.container.clearChild();
        this._overlaysList.appendChild(this.overlayEleItems.bottom);
        layerZIndex.forEach(lay => {
            this.overlayEleItems.container.appendChild(this.overlayEleItems.items[lay.ind])
        });
        this._overlaysList.appendChild(this.overlayEleItems.top);
    }
});

L.control.orderlayersIBAS = function (baseLayers, overlays, options) {
    return new L.Control.OrderLayersIBAS(baseLayers, overlays, options);
};