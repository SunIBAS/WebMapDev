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

L.Control.OrderLayersIBASGroup = L.Control.Layers.extend({
    options: {
        position: 'topright',
        collapsed: false,
        title: 'Layer Manager',
        showBaselayers: true,
        autoZIndex: false,
        groupCheckboxes: false
    },

    overlayEleItems: {
        container: null,
        groups: {},
        bottom: null,
        top: null,
        fromIndex: 30,
        groupIndex: []
    },

    initialize: function (baseLayers, groupedOverlays, options) {
        this.overlayEleItems.fromIndex = options.fromIndex ? options.fromIndex : this.overlayEleItems.fromIndex;
        delete options.fromIndex;
        L.Util.setOptions(this, options);

        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];
        this._layerControlInputs = [];

        for (var k in baseLayers) {
            this._addLayer(baseLayers[k], k);
        }

        let groundIndex = 0;
        let curIndex = this.overlayEleItems.fromIndex;
        for (var i in groupedOverlays) {
            this.overlayEleItems.groups[i] = {
                children: 0,
                index: groundIndex,
                fromIndex: curIndex,
                toIndex: curIndex - 1,
                items: {},
                order: []
            };
            this.overlayEleItems.groupIndex.push(i);
            for (var j in groupedOverlays[i]) {
                this.overlayEleItems.groups[i].children++;
                this.overlayEleItems.groups[i].toIndex++;
                curIndex++;
                this._addLayer(groupedOverlays[i][j], j, i, true);
                groupedOverlays[i][j].setZIndex(curIndex);
                this.overlayEleItems.groups[i].order.push(j);
            }
            this.overlayEleItems.groups[i].groupId = this._indexOf(this._groupList, i);
        }
    },

    _addLayer: function (layer, name, group, overlay) {
        L.Util.stamp(layer);

        var _layer = {
            layer: layer,
            name: name,
            overlay: overlay
        };
        this._layers.push(_layer);

        group = group || '';
        var groupId = this._indexOf(this._groupList, group);

        if (groupId === -1) {
            groupId = this._groupList.push(group) - 1;
        }

        overlay ? _layer.group = {
            name: group,
            id: groupId,
        } : _layer.group = null;
    },

    _indexOf: function (arr, obj) {
        for (var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    },

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
        this._overlaysList.style.display = 'inline-block';
        this._overlaysList.style.textAlign = 'left';

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
        for(i = 0; i < overlaysLayers.length; i++) {
            if(overlaysLayers[i]) {
                this._addItem(overlaysLayers[i]);
            }
        }
        this._overlaysList.appendChild(TopLayer);

        this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

        this._hideArrow();
        return this;
    },

    _addEle(tagName,className,parent, appendChilds, attrs) {
        let col = L.DomUtil.create(tagName, className);
        parent ? parent.appendChild(col) : null;
        (appendChilds || []).forEach(c => col.appendChild(c));
        for (let i in (attrs || {})) {
            if (typeof attrs[i] === 'object') {
                for (let j in attrs[i])
                    col[i][j] = attrs[i][j];
            } else {
                col[i] = attrs[i];
            }
        }
        return col;
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

        this._addEle('span','',label).innerHTML = ' ' + obj.name;

        var row = L.DomUtil.create('div', 'leaflet-row');

        this._addEle('div', 'leaflet-input',row,[input]);

        this._addEle('div', 'leaflet-name',row,[
            this._addEle('label', 'leaflet-icon',null,null,{
                htmlFor: input.id
            }),
            label]);

        label.htmlFor = input.id;

        var container;
        if(obj.overlay) {
            let upBtn = this._addEle('div', 'leaflet-up',row);
            obj.layerId = layerId;
            L.DomEvent.on(upBtn, 'click', this._onUpClick.bind(this,obj), this);

            let downBtn = this._addEle('div', 'leaflet-down',row);
            L.DomEvent.on(downBtn, 'click', this._onDownClick.bind(this,obj), this);

            container = this._getGroup(obj);
            this.overlayEleItems.container = container;
            this.overlayEleItems.groups[obj.group.name].items[layerId] = row;
            this.overlayEleItems.groups[obj.group.name].order =
                this.overlayEleItems.groups[obj.group.name].order.map(_ => {
                if (_ === obj.name) {
                    return layerId;
                } else {
                    return _;
                }
            });
        } else {
            container = this._baseLayersList;
        }
        container.appendChild(row);
        this._checkDisabledLayers();
        return label;
    },

    _getGroup(obj) {
        if (!this.overlayEleItems.groups[obj.group.name].ele) {
            var groupContainer = this._addEle(
                'div', 'leaflet-control-layers-group',null,[],{
                id : 'leaflet-control-layers-group-' + obj.group.id,
                style: {
                    display: 'inline-block',
                    borderBottom: '1px solid'
                }
            });

            var row = L.DomUtil.create('div', 'leaflet-row');
            this._addEle("span",'leaflet-control-layers-group-name',
                this._addEle('div', 'leaflet-name',row,[],{
                    style: {
                        width: '74%',
                        "font-size": "14px",
                        "font-weight": "bold",
                    }
                }),[],{
                innerHTML: obj.group.name
            });
            groupContainer.appendChild(row);


            let upBtn = this._addEle('div', 'leaflet-up',row);
            L.DomEvent.on(upBtn, 'click', this._onGroupUpClick.bind(this,obj.group.name), this);

            let downBtn = this._addEle('div', 'leaflet-down',row);
            L.DomEvent.on(downBtn, 'click', this._onGroupDownClick.bind(this,obj.group.name), this);

            this.overlayEleItems.groups[obj.group.name].ele = groupContainer;
            this.overlayEleItems.groups[obj.group.name].topEle = row;
            this._overlaysList.appendChild(groupContainer);
        }
        return this.overlayEleItems.groups[obj.group.name].ele;
    },

    _onUpClick: function(obj) {
        let groupName = obj.group.name,
            orders = this.overlayEleItems.groups[groupName].order,
            layerId = obj.layerId;
        // 包含且不是第一个
        if (orders.includes(layerId) && orders[0] !== layerId) {
            let ind = orders.indexOf(layerId);
            orders[ind] = orders[ind - 1];
            orders[ind - 1] = layerId;
            this._rebuildTheGroup(groupName,orders);
            this._hideArrow();
        }
    },

    _onDownClick: function(obj) {
        let groupName = obj.group.name,
            orders = this.overlayEleItems.groups[groupName].order,
            layerId = obj.layerId;
        // 包含且不是第一个
        if (orders.includes(layerId) && orders[orders.length - 1] !== layerId) {
            let ind = orders.indexOf(layerId);
            orders[ind] = orders[ind + 1];
            orders[ind + 1] = layerId;
            this._rebuildTheGroup(groupName,orders);
            this._hideArrow();
        }
    },

    _rebuildTheGroup(groupName,orders) {
        // 1. 重绘 html 元素
        let ele = this.overlayEleItems.groups[groupName].ele;
        let items = this.overlayEleItems.groups[groupName].items;
        let zindex = this.overlayEleItems.groups[groupName].fromIndex;
        ele.clearChild().appendChild(this.overlayEleItems.groups[groupName].topEle);
        orders.forEach(_ => {
            // 重新绑定元素
            ele.appendChild(items[_]);
            // 重新设置 ZIndex
            this._layers[_].layer.setZIndex(zindex);
            zindex++;
        });
    },

    _hideArrow() {
        for (let groupName in  this.overlayEleItems.groups) {
            let order = this.overlayEleItems.groups[groupName].order;
            let items = this.overlayEleItems.groups[groupName].items;
            for (let ind in items) {
                if (ind == order[0]) {
                    items[ind].getElementsByClassName('leaflet-up')[0].style.opacity = 0;
                } else {
                    items[ind].getElementsByClassName('leaflet-up')[0].style.opacity = 1;
                }
                if (ind == order[order.length - 1]) {
                    items[ind].getElementsByClassName('leaflet-down')[0].style.opacity = 0;
                } else {
                    items[ind].getElementsByClassName('leaflet-down')[0].style.opacity = 1;
                }
            }
            if (groupName === this.overlayEleItems.groupIndex[0]) {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-up')[0].style.opacity = 0;
            } else {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-up')[0].style.opacity = 1;
            }
            if (groupName === this.overlayEleItems.groupIndex[this.overlayEleItems.groupIndex.length - 1]) {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-down')[0].style.opacity = 0;
            } else {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-down')[0].style.opacity = 1;
            }
        }
    },

    _rebuildGroups() {
        this._overlaysList.clearChild();
        for (let i in this.overlayEleItems.groupIndex) {
            this._overlaysList.appendChild(this.overlayEleItems.groups[this.overlayEleItems.groupIndex[i]].ele);
        }
    },

    _onGroupUpClick(groupName) {
        if (this.overlayEleItems.groupIndex.includes(groupName) && this.overlayEleItems.groupIndex[0] !== groupName) {
            let ind = this.overlayEleItems.groupIndex.indexOf(groupName);
            let exGroupName = this.overlayEleItems.groupIndex[ind - 1];
            this.overlayEleItems.groupIndex[ind] = exGroupName;
            this.overlayEleItems.groupIndex[ind - 1] = groupName;
            this.overlayEleItems.groups[groupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex;
            this.overlayEleItems.groups[exGroupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex + this.overlayEleItems.groups[groupName].children;
            this._rebuildGroups();
            this._rebuildTheGroup(groupName,this.overlayEleItems.groups[groupName].order);
            this._rebuildTheGroup(exGroupName,this.overlayEleItems.groups[exGroupName].order);
            this._hideArrow();
        }
    },
    _onGroupDownClick(groupName) {
        if (this.overlayEleItems.groupIndex.includes(groupName) && this.overlayEleItems.groupIndex[this.overlayEleItems.groupIndex - 1] !== groupName) {
            let ind = this.overlayEleItems.groupIndex.indexOf(groupName);
            let exGroupName = this.overlayEleItems.groupIndex[ind + 1];
            this.overlayEleItems.groupIndex[ind] = exGroupName;
            this.overlayEleItems.groupIndex[ind + 1] = groupName;
            this.overlayEleItems.groups[groupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex;
            this.overlayEleItems.groups[exGroupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex + this.overlayEleItems.groups[groupName].children;
            this._rebuildGroups();
            this._rebuildTheGroup(groupName,this.overlayEleItems.groups[groupName].order);
            this._rebuildTheGroup(exGroupName,this.overlayEleItems.groups[exGroupName].order);
            this._hideArrow();
        }
    },
});

L.control.orderlayersIBASGroup = function (baseLayers, overlays, options) {
    return new L.Control.OrderLayersIBASGroup(baseLayers, overlays, options);
};