const defined = Cesium.defined;
const LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK;
const RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
const MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE;
const MOUSE_DOWN = Cesium.ScreenSpaceEventType.LEFT_DOWN;
const MOUSE_UP = Cesium.ScreenSpaceEventType.LEFT_UP;
function setString(str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            return s + "...";
        }
    }
    return s;
}
class MarkerManager {
    constructor(viewer, markerOptions = CesiumBillboard.defaultStyle,
                labelOptions = CesiumBillboard.defaultLabelStyle, modelOptions = CesiumModel.defaultStyle) {
        if (viewer instanceof Cesium.Viewer) {
            this._viewer = viewer
        }
        if (!Cesium.defined(this._viewer)) {
            return
        }
        /**
         * 表示当前添加的标记类型,marker,label,model
         */
        this.markName = ''
        this.markRemark = ''
        this.markMode = 'marker'
        this.defaultImage = CesiumBillboard.defaultStyle.image
        this.selectedImage = undefined
        this.popWinPosition = undefined
        this.markerid = undefined
        this.markerOptions = markerOptions;
        this.labelOptions = labelOptions;
        this.modelOptions = modelOptions;
        //  todo utils
        this.cursorTip = new CursorTip(
            "左键标绘，右键结束.",
            "marker-tip",
            viewer
        );
        this.cursorTip.visible = false;

        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.manager = new Map();
        this.pickHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.init(this._viewer)
        this.dearObj = {
            tar: {
                [GraphicType.MARKER]: "MARKER",
                [GraphicType.POLYGON]: "POLYGON",
                [GraphicType.POLYLINE]: "POLYLINE",
                // 附加方法
                [GraphicType.MARKER + "ADD"]: "MARKERADD",
                [GraphicType.POLYGON + "ADD"]: "POLYGONADD",
                [GraphicType.POLYLINE + "ADD"]: "POLYLINEADD",
            },
            MARKER() {
            },
            POLYGON() {},
            POLYLINE() {},
            // 附加方法
            MARKERADD() {},
            POLYGONADD() {},
            POLYLINEADD() {}
        };
        this.addDearObjMethod("MARKER",function ($this,obj) {
            $this.selectedMarker = $this.manager.get(obj.id.gvid);
            if (!self.popDiv) {
                $this.createPopPanel();
            }
        });
        this.offset = false;
        this.selfPops = [/*{
            position: c3,
            div: div,
            id: "",
        }*/];
    }

    // todo auth:IBAS 这个方法是为了可以联合作者其他代码实现特殊功能
    // name : "MARKER", "POLYLINE", "POLYGON", "LABEL", "MODEL"
    // method :
    addDearObjMethod(name,method) {
        if (name in this.dearObj) {
            this.dearObj[name] = method;
        }
    }

    init(viewer) {
        if (viewer instanceof Cesium.Viewer === false) {
            throw new Error("viewer不是一个有效的Cesium Viewer对象.");
        }
        const handler = this.handler;
        const self = this;
        const manager = this.manager
        //气泡跟随地球移动
        viewer.scene.postRender.addEventListener(function () {
            if (defined(self.popWinPosition)) {
                const pos = CVT.cartesian2Pixel(self.popWinPosition, viewer);

                const ele = document.getElementById("popContainer");
                if (!ele) {
                    return;
                }
                self._reCalcDivPosition(ele,self.popWinPosition,-5,0);

                // ele.style.display = "block";
            }
            self.selfPops.forEach(pop => {
                self._reCalcDivPosition(pop.ele,pop.position,-5,0);
            });
        });
        const showTip = function (e) {
            const obj = viewer.scene.pick(e.position);
            self.destroyPopPanle();
            if (
                defined(obj) &&
                obj.id instanceof Cesium.Entity
            ) {
                if (obj.id.gvtype in self.dearObj.tar) {
                    self.dearObj[self.dearObj.tar[obj.id.gvtype]](self,obj);
                    // 附加方法
                    self.dearObj[self.dearObj.tar[obj.id.gvtype + "ADD"]](self,obj);
                }
                //   self.popWinPosition = CVT.pixel2Cartesian(e.position, viewer);
                // self.selectedMarker = manager.get(obj.id.gvid);
                // if (!self.popDiv) {
                //     self.createPopPanel();
                // }
            }
        };

        handler.setInputAction(showTip, LEFT_CLICK);
    }
    // 在更新相机位置时提供重新计算的方法
    _reCalcDivPosition(ele,position,xOffset,yOffset) {
        const pos = CVT.cartesian2Pixel(position, viewer);

        let h = parseInt(ele.style.height);
        ele.getElementsByClassName('arrow')[0].style.top = h + "px";
        h += 11;
        ele.style.left = pos.x - 100 + (xOffset || 0) + "px";
        ele.style.top = pos.y - h + (yOffset || 0) + "px";

        const curPos = position;
        //标记转到地球背面隐藏气泡 todo utils
        if (pointVisibilityOnEarth(curPos, this._viewer)) {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    }
    /**
     * 开始拾取marker，调用该方法后开始监听鼠标单击，添加标记
     * @param {string} type表示何种标记,marker:billboard，label:label,model:model
     * @param {string} mode如果mode不是single，将连续添加标记
     */
    pick({type, mode, tar}, cb) {
        cb = cb || (() => {});
        this.markMode = type || "marker";
        mode = mode || "single";
        const viewer = this._viewer;
        this.cursorTip.visible = true;
        const handler = this.pickHandler
        const self = this;
        const id = this.generateId(tar);
        self.markerid = id;
        const manager = this.manager

        const pick = function (e) {
            const cartesian = CVT.pixel2Cartesian(e.position, viewer);
            if (Cesium.defined(cartesian)) {
                // mp.position = cartesian;
                let marker;
                if (type === "marker") {
                    marker = self.createMarker(cartesian);
                } else if (type === "label") {
                    marker = self.createLabel(cartesian);
                } else if (type === "model") {
                    marker = self.createModel(cartesian);
                } else {
                    //默认marker
                    marker = self.createMarker(cartesian);
                }
                self.visible = true;
                manager.set(id, marker);
                marker.gvid = id;
                // marker.gvname = "未命名" + viewer.entities.values.length;

                self.selectedMarker = marker;
                self.activeMarker = marker;

                self.cursorTip.visible = false;
                if (type === "model") {
                    self.activeMarker = undefined;
                }
                if (mode === "single") {
                    handler.removeInputAction(LEFT_CLICK);
                    handler.removeInputAction(RIGHT_CLICK);
                }
                const evt = new CustomEvent('marker-add', {
                    detail: {
                        id: marker.gvid,
                        name: marker.gvname || '未命名',
                        description: marker.description,
                        type: marker.gvtype,
                        position: CVT.toDegrees(cartesian,self._viewer)
                    }
                })
                window.dispatchEvent(evt)
                // marker = undefined
                return cb({id,marker});
            }
            cb(null);
        };
        const cancel = function () {
            handler.removeInputAction(LEFT_CLICK);
            handler.removeInputAction(RIGHT_CLICK);
            // handler.destroy();
            self.cursorTip.visible = false;
            const id = self.activeMarker ? self.activeMarker.id : undefined
            const evt = new CustomEvent('marker-delete',
                {
                    detail: {
                        id: id
                    }
                })
            window.dispatchEvent(evt)

            self.activeMarker = undefined;
            //handler=undefined
        };
        const updateTip = function (e) {
            self.cursorTip.updatePosition(e.endPosition);
        };
        handler.setInputAction(cancel, RIGHT_CLICK);

        handler.setInputAction(pick, LEFT_CLICK);
        handler.setInputAction(updateTip, MOUSE_MOVE);
        return pick;
    }
    // todo auth:IBAS
    // 添加自定义的标记
    // position click.position
    addCustomMarker(position,{description,text},cb) {
        console.log(`pointion:${position}`)
        let $this = this;
        this.pick({tar: "custom"},function ({id}) {
            setTimeout(() => {
                $this.manager.get(id).description = description || "暂无";
                $this.manager.get(id).text = text || "暂无";
                (cb || (()=>{}))();
            });
        })({position});
    }
    get(id){
        if(this.has(id)){
            return this.manager.get(id)
        }
    }
    has(id){
        if(this.manager){
            return this.manager.has(id)
        }
        return false
    }
    createMarker(cartesian) {

        const mp = this.labelOptions;
        const marker = new CesiumBillboard(
            this._viewer,
            { ...this.markerOptions, position: cartesian, image: this.selectedImage },
            mp
        );
        return marker;
    }
    changeHandler(img) {
        this.selectedImage = img;
        this.activeMarker.updateImage(this.selectedImage);
    }
    panelPosition() {
        if (this.activeMarker) {
            if (this.markMode === "marker") {
                const position = this.activeMarker.graphic.position.getValue();
                const pixel = CVT.cartesian2Pixel(position, this._viewer);
                const x = pixel.x > 170 ? pixel.x - 170 : pixel.x + 10;
                const y = pixel.y > 210 ? pixel.y - 240 : pixel.y + 50;
                return { x: x, y: y };
            } else {
                const position = this.activeMarker.graphic.position.getValue();
                const pixel = CVT.cartesian2Pixel(position, this._viewer);
                const x = pixel.x + 10;
                const y = pixel.y - 25;
                return { x: x, y: y };
            }
        } else {
            return { x: 0, y: 0 };
        }
    }
    createLabel(cartesian) {
        const options = this.labelOptions;
        options.position = cartesian;

        const marker = new CesiumLabel(this._viewer, options);
        return marker;
    }
    createModel(cartesian) {
        const options = this.modelOptions;
        options.position = cartesian;
        const marker = new CesiumModel(this._viewer, options);

        return marker;
    }
    removeEventListener() {
        const pickHandler = this.pickHandler
        if (pickHandler) {
            if (!pickHandler.isDestroyed()) {
                // pickHandler.destroy();
                pickHandler.removeInputAction(LEFT_CLICK);
                pickHandler.removeInputAction(RIGHT_CLICK);
                pickHandler.removeInputAction(MOUSE_MOVE);
            }
        }
    }
    stopPick() {
        this.removeEventListener();
        if (this.activeMarker) {
            this.activeMarker.destroy();
            const evt = new CustomEvent('marker-delete',
                {
                    detail: {
                        id: this.activeMarker.gvid
                    }
                })
            window.dispatchEvent(evt)

        }
        this.activeMarker = undefined;
        this.cursorTip.visible = false;
    }
    zoomTo(id) {
        if (this.manager.has(id)) {
            this.manager.get(id).zoomTo();
        }
    }
    edit(id) {
        const manager = this.manager
        if (manager.has(id)) {
            const mm = manager.get(id);
            this.activeMarker = mm
            mm.startEdit()
            if (
                mm.gvtype === GraphicType.MARKER ||
                mm.gvtype === GraphicType.LABEL
            ) {
                this.markName = this.activeMarker.gvname;
                this.markRemark = this.activeMarker.description;
                this.visible = true;
            }
            // this.activeMarker.zoomTo();
            const pixel = this.panelPosition()
            const evt = new CustomEvent('marker-edit', {
                detail: {
                    name: this.markName,
                    remark: this.markRemark,
                    type: this.activeMarker.type,
                    pos: pixel
                }
            })
            window.dispatchEvent(evt)
        }
    }
    drop(id) {
        const mm = this.manager.get(id);
        mm && mm.destroy();
        this.manager.delete(id);
    }
    rename(id, name) {
        const mm = this.manager.get(id);
        mm.gvname = name;
    }
    select(type, id, status) {
        if (defined(id)) {
            const manager = this.manager.get(id);
            if (defined(manager)) {
                manager.show = status;
            }
        }
        if (defined(type)) {
            const values = this.manager.values();
            for (let v of values) {
                if (v.gvtype === type) {
                    v.show = status;
                }
            }
        }
    }
    destroyPopPanle() {
        if (this.popDiv) {
            $(this.popDiv).remove()
            this.popDiv = undefined;
        }
    }
    destroy() {
        this.removeAll()
        this.destroyPopPanle()
        if (!this.pickHandler.isDestroyed()) {
            this.pickHandler.destroy()
        }
        if (!this.handler.isDestroyed()) {
            this.handler.destroy()
        }
        this._viewer = undefined
        this.labelOptions = undefined
        this.markerOptions = undefined;
        this.modelOptions = undefined
    }
    // todo auth:IBAS
    // 创建自定义的 pop
    // c3 是 viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)
    // infos 是一个对象，例如 {"描述","信息"}
    createCustomPopPanel(c3,infos) {
        if (this.popDiv) {
            this.destroyPopPanle();
        }
        this.offset = false;
        this.popWinPosition = c3;
        const coord = CVT.cartesian2Degrees(c3, this._viewer);
        let popdiv = this._createPopDom(coord,infos);

        this.popDiv = popdiv;
        this._viewer.container.appendChild(this.popDiv);
    }
    createPopPanel() {
        //
        if (!defined(this.selectedMarker)) {
            return;
        }
        if (this.popDiv) {
            this.destroyPopPanle();
        }
        this.offset = true;
        const position = this.selectedMarker.position;
        this.popWinPosition = position;
        const coord = CVT.cartesian2Degrees(position, this._viewer);
        let popdiv = this._createPopDom(coord,{描述: this.selectedMarker.description || "暂无"});

        this.popDiv = popdiv;
        this._viewer.container.appendChild(this.popDiv);
    }
    // selfControl 默认为 false 表示组件内使用，否则是一个 函数用来作为删除回调
    // 区别就是关闭按钮
    _createPopDom(coord,infos,selfControl,selfId) {
        let height = 28 + 12;
        const popdiv = document.createElement("div");
        // popdiv
        {
            popdiv.id = selfId || "popContainer";
            popdiv.className = "marker-popWin-class";
            popdiv.style.display = "none";
        }
        // 关闭按钮
        {
            const closebtn = document.createElement("span");
            closebtn.className = "iconfont iconclose closebtn";
            closebtn.innerText = "x"
            closebtn.style.width = "11px";
            closebtn.style.height = "12px";
            closebtn.style.background = "black";
            closebtn.style.color = "white";
            closebtn.style.margin = "10px 0";
            closebtn.style.lineHeight = "10px";
            closebtn.onclick = (function (self) {
                $(self.popDiv).remove()
                self.popDiv = undefined;
                selfControl();
            }).bind(null,selfControl ? {popDiv:popdiv}:this);
            popdiv.appendChild(closebtn);
        }
        // 信息
        {
            for (let i in infos) {
                let remarkdiv = document.createElement('span');
                if (typeof infos[i] === "undefined") {
                    infos[i] = '暂无';
                } else {
                    infos[i] += "";
                }
                remarkdiv.title = infos[i]
                remarkdiv.innerText = i + ":" +
                    setString(infos[i], 14);
                popdiv.appendChild(remarkdiv);
                height += 28;
            }
        }
        // 经纬度
        {
            let coordsdiv = document.createElement("span");
            coordsdiv.innerText =
                "经度:" + coord.lon.toFixed(2) + "  纬度:" + coord.lat.toFixed(2);
            popdiv.appendChild(coordsdiv);
        }
        // 底下箭头
        {
            const arrow = document.createElement("div");
            arrow.className = "arrow";
            popdiv.appendChild(arrow);
        }
        popdiv.style.height = height + "px";
        return popdiv;
    }
    createSelfControlPopDom(c3,infos){
        const coord = CVT.cartesian2Degrees(c3, this._viewer);
        let id = this.generateId("self")
        let div = this._createPopDom(coord,infos,(function (id) {
            let index = -1;
            this.selfPops.forEach((t,ind) => {
                if (t.id === id) index = ind;
            });
            if (index !== -1) {
                this.selfPops.splice(index,1);
            }
        }).bind(this,id),id);
        // div.setAttribute("tid",id);
        this._viewer.container.appendChild(div);
        this.selfPops.push({
            position: c3,
            ele: div,
            id: id
        })
    }
    clearAllSelfPopDom() {
        this.selfPops.forEach(_ => {
            _.ele.remove();
        });
        this.selfPops = [];
    }

    import(feat) {
        if (feat.geometry.type.toUpperCase() !== "POINT") {
            throw new Error("无效的数据类型.");
        }
        const id = this.generateId();
        let marker;
        if (feat.properties.gvtype === GraphicType.LABEL) {
            const lopts = CesiumLabel.defaultStyle;
            lopts.position = Cesium.Cartesian3.fromDegrees(
                ...feat.geometry.coordinates
            );
            lopts.text = feat.properties.name;
            marker = new CesiumLabel(this._viewer, lopts);
        } else {
            const coord = {
                lon: feat.geometry.coordinates[0],
                lat: feat.geometry.coordinates[1],
                height: feat.geometry.coordinates[2]
            };
            marker = CesiumBillboard.fromDegrees(this._viewer, coord);
        }
        marker.gvname = feat.properties.name;
        marker.description = feat.properties.description;
        marker.gvid = id;
        this.manager.set(id, marker);
        const evt = new CustomEvent('marker-add', {
            detail: {
                id: marker.gvid,
                name: marker.gvname || '未命名',
                type: marker.gvtype,
                description: marker.description,
                properties: feat.properties,
                position: {
                    lon: feat.geometry.coordinates[0],
                    lat: feat.geometry.coordinates[1],
                    height: feat.geometry.coordinates[2]
                }
            }
        })
        window.dispatchEvent(evt)
    }
    addMarker(marker){
        this.manager.set(marker.gvid,marker)
    }
    // noCustom custom 插入的不要导出，默认导出
    // wirte 是否执行后立即下载，默认 否
    export(type,noCustom,write) {
        const managers = this.manager.values();
        const json = {
            type: "FeatureCollection",
            name: "graphic",
            crs: {
                type: "name",
                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
            },
            features: []
        };

        type = type || "MARKER";
        for (let m of managers) {
            if (m.type === type) {
                if (!(noCustom && m.gvid.startsWith("custom-"))) {
                    let j = m.toGeoJson();
                    j.properties.description = m.description;
                    json.features.push(j);
                }
            }
        }
        if (write) {
            const blob = new Blob([JSON.stringify(json)], { type: "" });
            window.saveAs(blob, type + parseInt(Cesium.getTimestamp()) + ".geojson");
        } else {
            return json;
        }
    }

    set font(font) {
        this.labelOptions.font = font
        if (this.activeMarker) {
            this.activeMarker.font = font;
        }
    }
    get font() {
        if (this.activeMarker) {
            return this.activeMarker.font;
        }
        return undefined;
    }
    set color(color) {
        this.labelOptions.fillColor = color;
        if (this.activeMarker) {
            this.activeMarker.color = color;
        }
    }
    set label(option) {
        const keys = Object.keys(option);
        for (let key of keys) {
            this.labelOptions[key] = option[key];
        }
        // this.modelAndLabelOptions=[...this.modelAndLabelOptions,...option]
        if (this.activeMarker) {
            this.activeMarker.setLabel(this.labelOptions);
        }
    }
    set model(options) {
        this.modelOptions = { ...this.modelOptions, ...options };
        if (this.activeMarker) {
            if (options.uri) {
                this.activeMarker.uri = options.uri;
            }
            if (options.color) {
                this.activeMarker.color = options.color;
            }
            if (options.mode != undefined) {
                this.activeMarker.model = options.mode;
            }
            if (options.mixed != undefined) {
                this.activeMarker.mixed = options.mixed;
            }
        }
    }
    removeAll() {
        const values = this.manager.values();
        for (let v of values) {
            v.remove();
            v.destroy();
        }
        this.manager.clear();
    }
    cancelMark() {
        this.activeMarker && this.activeMarker.destroy();
        this.activeMarker = undefined;
        this.cursorTip.visible = false;
        const evt = new CustomEvent('marker-delete', {
            detail: {
                id: this.markerid
            }
        })
        window.dispatchEvent(evt)
        this.markName = "";
        this.markRemark = "";
        this.manager.delete(this.markerid);
        this.markerid = undefined;
        this.removeEventListener();
    }
    update(name, remark) {
        this.markName = name;
        this.markRemark = remark
        this.activeMarker.updateText(this.markName, this.markRemark);
        this.cursorTip.visible = false;
        this.activeMarker.stopEdit()
        const evt = new CustomEvent('marker-update', {
            detail: {
                id: this.activeMarker.gvid,
                name: this.activeMarker.gvname,
                description:this.activeMarker.description,
                position:CVT.toDegrees(this.activeMarker.position,this._viewer)
            }
        })
        window.dispatchEvent(evt)
        this.activeMarker = undefined;
        this.removeEventListener();
    }
    generateId(tar) {
        tar = tar || "self";
        return (
            tar +
            "-" +
            (Math.random() * 10000000).toString(16).substr(0, 4) +
            "-" +
            new Date().getTime() +
            "-" +
            Math.random()
                .toString()
                .substr(2, 5)
        );
    }
}

// const defaultMarkerManager = new MarkerManager(viewer);