class PointEntity {
    static createPointEntity(long,lat,label) {
        var cartesian = Cesium.Cartesian3.fromDegrees(long, lat);
        var entity = mapHandle.DrawHelper.createBlackBackgroundLabel(cartesian, label, "entity_" + label,false);
        entity.properties = {
            _long: long,_alt: lat,_title: label
        }; //关联信息
        return entity;
    }

    constructor(viewer) {
        this._viewer = viewer;
        this.entity = viewer.entities.add(new Cesium.Entity());
        this.mapper = {};
    }

    /**
     * 添加一系列 点
     * @param dataList [ { "名字": "ibas", "经度": "55", "维度": "55" } ]
     * @param longKey   经度
     * @param latKey    维度
     * @param labelKey  名字
     * @param type      随意，可用于查找
     */
    addPoints(dataList, longKey, latKey,labelKey , type) {
        for (var i = 0; i < dataList.length; i++) {
            var info = dataList[i];
            if (info && info[longKey] && info[latKey]) {
                var long = info[longKey],
                    alt = info[latKey],
                    label = info[labelKey];

                if (long && alt) {
                    var cartesian = Cesium.Cartesian3.fromDegrees(long, alt);
                    var entity = mapHandle.DrawHelper.createBlackBackgroundLabel(cartesian, label, "entity_" + label);
                    entity.properties = {
                        ...info,_long: long,_alt: alt,_title: label
                    }; //关联信息
                    this.mapper[label] = { long,alt,id: "entity_" + label }

                    if (this.entity) entity.parent = this.entity;
                    if (type) entity.entityType = type;
                }
            }
        }
    }

    /**
     * 将摄像头转移到 指定节点
     * @param label (addPoint 的 label 参数)
     */
    flytoByEntityProperties(label) {
        if (label in this.mapper) {
            this._viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    this.mapper[label].long,
                    this.mapper[label].alt,
                    35000.0),
                duration: 1,
            });
        }
    }

    /**
     * 高亮
     * @param label
     */
    highlightEntity(labels) {
        if (Cesium.defined(this.entity)) {
            if (this.entity && this.entity._children && this.entity._children.length > 0) {
                this.entity._children.forEach(function (value) {
                    value.label.fillColor.setValue(Cesium.Color.fromCssColorString("#ffffff"));
                });
            }
        }
        labels.forEach(label => {
            if (label && label in this.mapper) {
                let _e = this.entity.entityCollection.getById(this.mapper[label].id);
                if (_e) {
                    _e.label.fillColor.setValue(Cesium.Color.fromCssColorString("#00ffd0"));
                }
            }
        });
    }

    /**
     * 清除所有内容
     */
    clearEntityChildren() {
        if (this.entity && this.entity._children && this.entity._children.length > 0) {
            this.entity._children.forEach(function (value) {
                window.viewer.entities.remove(value);
            });
        }
    }
}

const panelCallback = {
    clearCallback() {}
}

class Apis {
    // static panelCallback = {
    //     clearCallback() {}
    // }
    // destination 地图初始化看到的位置和缩放等级
    constructor(baseView) {
        this._baseView = baseView;
        this._parentWindows = null;
        this.viewer = null;
        this._layerIds = {
            imageryProvider: [],
            dom: [],
            entityAndCss3Rnederer: [],
            datasource: []
        };
        // 用于设置坐标轴的时间，分别表示开始和结束时间
        this._fromJulianDate = null;
        this._toJulianDate = null;
        this._timeline = null;
        // 这个是定义在 lib/index/initMapViews.js 中的用于创建和销毁绘图工具的组件 MarkerAndGraphicManager
        this._magm = null;
        // 绘图完成后，点击区域的回调
        this._magmMethods = {
            "MARKER"(){},
            "POLYLINE"(){},
            "POLYGON"(){},
            "LABEL"(){},
            "MODEL"(){},
            "OTHER"() {},
        };
        this._nullMagmMethods = {
            "MARKER"(){},
            "POLYLINE"(){},
            "POLYGON"(){},
            "LABEL"(){},
            "MODEL"(){},
            "OTHER"() {},
        };
        this._defaultPlayTime = 3600 * 24; // 默认的播放速度
        // 地图点击回调
        this._mapOnClickCallBack = ()=>{};
        this.pointEntity = null;
        this.clusterDataSource = null;
    }

    setPanelCallback(obj) {
        for (let i in obj) {
            if (i in panelCallback) {
                panelCallback[i] = obj[i];
            }
        }
    }

    init(viewer,magm) {
        if (window.parent === window) {
            this._parentWindows = window;
        } else {
            this._parentWindows = window.parent;
        }
        this.viewer = viewer;
        this._magm = magm;
        let d = (() => {
            let d = new Date();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            return [
                `${d.getFullYear()}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`,
                `${d.getFullYear() + 1}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`,
            ]
        })();
        this._fromJulianDate = CesiumUtils.getJulianDate(d[0]);
        this._toJulianDate = CesiumUtils.getJulianDate(d[1]);
        this._resetTime();
        new TimeLine(this.viewer).UTC();
        for (let i in this._magmMethods) {
            this._magm.MarkManager.addDearObjMethod(i,($markerManager,obj) => {
                if ($markerManager) {
                    if (!obj.id.gvid) {
                        return;
                    }
                    let gobj = window.MarkerAndGraphicManager.GraphicManager.get(obj.id.gvid);
                    let geojson = null;
                    if (gobj) {
                        geojson = gobj.toGeoJson();
                    } else {
                        gobj = window.MarkerAndGraphicManager.MarkManager.get(obj.id.gvid);
                        if (gobj) {
                            geojson = gobj.toGeoJson();
                        }
                    }
                    this._magmMethods[i]($markerManager,obj,gobj,geojson);
                } else {
                    this._magmMethods[i](obj);
                }
            });
        }
        return this;
    }
    initOk() {
        console.clear();
        this._parentWindows.initOk();
    }
    _createId() {
        return `${new Date().getTime()}_${parseInt(Math.random() * 1000)}`;
    }
    // 恢复默认的时间轴刻度及时间
    _resetTime(onlyClear) {
        if (this._timeline) {
            this._timeline.setTimeLineChangeEvent(() => {});
            this._timeline = null;
        }
        // this._timeline = new TimeLine(this.viewer).UTC();
        if (!onlyClear) {
            this.viewer.clock.startTime = this._fromJulianDate;
            this.viewer.clock.stopTime = this._toJulianDate;
            this.viewer.clock.currentTime = this._fromJulianDate;
            this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            this.viewer.clock.multiplier = 1;
            this.viewer.timeline.zoomTo(this._fromJulianDate,this._toJulianDate);
            this.viewer.clock.shouldAnimate = false;
            // this.viewer.timeline.updateFromClock();
        }
    }

    setMapOnClickCallBack(cb) {
        this._mapOnClickCallBack = cb;
    }
    mapOnClick(obj) {
        this._mapOnClickCallBack(obj);
    }

    // 可以添加 wms 影像
    addSingleLayer(url,layers,parameters) {
        let provider = new Cesium.WebMapServiceImageryProvider({
            enablePickFeatures: true,
            url,//: window.ips.api.geoserver + '/geoserver/zhibei/wms',
            layers,//: `zhibei:zhibei`,
            parameters,/*: {
                styles: 'zhibei:zhibei',
                service: 'WMS',
                transparent: true,
                format: 'image/png'
            }*/
        });
        provider.id = this._createId();
        this._layerIds.imageryProvider.push(provider.id);
        viewer.imageryLayers.addImageryProvider(provider);
        return provider;
    }
    // 输入参数是上一个函数的返回值的 id
    removeSingleLayer(providerId) {
        if (!providerId) return false;
        if (typeof providerId === 'object') {
            providerId = providerId.id;
        }
        let ind = this._layerIds.imageryProvider.indexOf(providerId);
        if (ind + 1) {
            for (let i = 0;i < this.viewer.imageryLayers._layers.length;i++) {
                if (this.viewer.imageryLayers._layers[i]._imageryProvider.id === providerId) {
                    this._layerIds.imageryProvider.splice(ind,1);
                    this.viewer.imageryLayers.remove(this.viewer.imageryLayers._layers[i]);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 添加标记
     * @param coord {lat:123,lng:456}
     * @param title 标题
     * @param description 描述
     * */
    addMark(coord,title,description,info,cb) {
        let p = CVT.Wgs842Pixel(coord,this.viewer);
        this._magm.usual.addMarker(p,{
            text: title,
            description,
            info
        },cb);
    }
    getGrapicObj() {}

    /**
     * @param startTime     2020-1-1
     * @param endTime       2020-1-31
     * @param url           参考 addSingleLayer @param url
     * @param parmeters     参考 addSingleLayer @param parmeters
     * @param pft           参数时一个日期 date = {year,month,day,dd}，返回值时 layers 和 query_layers
     *      function({year,month,day,dd}) { // dd 和下面 onChange 中的 d 对象中的 day 是同一个解释
     *          return {
     *              layer: `ndvi-${year}-${month}-${day}`,
     *              query_layers: `ndvi-${year}-${month}-${day}`, // 查询时有用，一般情况下无用
     *          }
     *      }
     * @param onChange      当时间改变时触发，参数时 j,d
     *       j 是 Cesium.JulianDate 对象 参考 https://cesium.com/docs/cesiumjs-ref-doc/JulianDate.html
     *       d 是一个日期对象 { Y,M,D,date,day } = {年，月，日，js日期对象，距离设置的开始时间相隔多久}
     *          例如 startTime 设置为 2020-2-1 当前的日期为 2020-2-5 那么 day 就是 4
     */
    addTimelineLayer(startTime,endTime,url,parmeters,pft,onChange) {
        this._resetTime(true);
        this._timeline = new TimeLine(this.viewer).UTC();
        this._timeline.set(startTime,endTime,url,parmeters,pft).init();
        if (onChange) {
            this._timeline.setTimeLineChangeEvent(onChange);
        }
        setTimeout(() => {
            this._layerIds.imageryProvider.push(this._timeline.providerId);
        })
        return this._timeline;
    }
    removeTimelineLayer() {
        if (this._timeline) {
            if (this._timeline.providerId) {
                this.removeSingleLayer(this._timeline.providerId);
                this.stop();
                this._timeline.setTimeLineChangeEvent(()=>{});
                this._resetTime();
            }
        }
    }

    drawer(show) {
        if (show) {
            this._magm.panel.show(true);
        } else {
            this._magm.GraphicManager.removeAll()
            this._magm.MarkManager.removeAll()
            this._magm.panel.show(false);
        }
    }

    /**
     * magmMethods 参数格式为
     *      {
     *          // magm 是 MarkerAndGraphicManager 对象
     *          // obj  是 lib/CesiumSeal/MarkerAndGraphicManager/ 下定义的 Graphic 对象
     *          // gobj 是 Graphic 对象的实例
     *          // geojson 是 obj 对象的 geojson
     *          "POLYGON"(magm,obj,geojson) {},
     *          // 目前实现的对象有 "MARKER", "POLYLINE", "POLYGON", "LABEL", "MODEL"
     *      }
     *  // 其中 OTHER 表示一种特色的格式，即该对象不是通过 markerAndGraph 创建的，格式如下
     *  magmMethods = {
     *      ”OTHER“(obj) {}
     *  }
     * */
    updateMagmMethod(magmMethods) {
        if (magmMethods) {
            for (let i in magmMethods) {
                if (i in this._magmMethods) {
                    this._magmMethods[i] = magmMethods[i];
                }
            }
        }
    }

    /**
     * 如果设置了时间轴，这个动作才有效，用于播放时间序列的影像
     * @param times 倍速，为秒的倍速，例如 设置为 3600*24 表示 1s 钟播放一天的影像
     * @param days  如果设置改参数相当于设置 times=3600*24*days
     * @usage 下面两种方法等价
     *      play(3600 * 24)
     *      play(false,1)
     */
    play(times,days) {
        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.multiplier = days ? days * 3600 * 24 : (times ? times : this._defaultPlayTime);
    }
    stop() {
        this.viewer.clock.shouldAnimate = false;
    }

    /**
     * 显示图例
     * @param url 图例的 url 全路径
     * @param bottom 为距离底部高度
     * @param imageMaxWidth 图片的最大宽度
     * */
    showImageLegend(url,{bottom,imageMaxWidth} = {}) {
        ImageLegend.init(url)
        ImageLegend.updateOption({
            bottom: bottom || ImageLegend.bottom.timeline.bottom,
            imageMaxWidth: imageMaxWidth || "100px"
        });
    }
    // 隐藏图例
    hideImageLegend() {
        ImageLegend.init(false)
    }

    // 添加矢量的 wms 数据
    addShpWMS(url,layers,parameters,clickCallBack) {
        let provider = new Cesium.WebMapServiceImageryProvider({
            enablePickFeatures: true,
            url,// : window.ips.api.geoserver + '/geoserver/planting_structure/wms',
            layers,//: layers.map(_ => `planting_structure:${_}`).join(','), //'planting_structure:urganch2019,planting_structure:nukus2019',
            parameters, /*: {
                // styles: 'planting_structure:planting_structure',
                service: 'WMS',
                transparent: true,
                format: 'image/png'
            }*/
        });
        provider.id = this._createId();
        this._layerIds.imageryProvider.push(provider.id);
        viewer.imageryLayers.addImageryProvider(provider);
        this._magm.usual.initVectorPickFeature(provider,null,function (c2,datas) {
            console.log(c2,datas);
            clickCallBack(c2,datas);
            // addFeatureOrOWS.addPolygonShpGetInfo()
            // addFeatureOrOWS.addPolygonShpGetInfo(datas[0].data,p => {
            //     return {
            //         面积: (+p.area).toFixed(2),
            //         // 类型: $this.types[(+p.MAX)]
            //     }
            // });
        });
        return provider;
    }
    // 供 addShpWMS 函数的回调使用的
    addPolygonShpGetInfo(datas,filterProper) {
        let obj = addFeatureOrOWS.addPolygonShpGetInfo(datas[0].data,filterProper);
        this._layerIds.dom.push(obj.dom.id);
    }
    // swat 用到
    addGeoJsonDataSource(url,param) {
        let ds = new Cesium.GeoJsonDataSource();
        return ds.load(url,param)
            .then(i => {
                this.viewer.dataSources.add(ds);
                this._layerIds.datasource.push(ds);
                return ds;
            });
    }
    // swat 用到
    // obj 是 GeoJsonDataSource 或其子集
    flash(obj,color) {
        window.MarkerAndGraphicManager.usual.flash.polyline(obj,4,color)
    }
    flyToExtent(extent) {
        CesiumUtils.flyToExtent(
            extent /*{
                up: 42.39,
                down: 41.14,
                left: 59.75,
                right: 61.51
            }*/
        ,this.viewer)
    }

    flashPolygonR(polygon) {
        let red = 1 - polygon.material._color._value.red;
        let green = 1 - polygon.material._color._value.green;
        let blue = 1 - polygon.material._color._value.blue;
        // let newColor = Cesium.Color.fromCssColorString(`rgba(${parseInt(256 * red)}, ${parseInt(256 * green)}, ${parseInt(256 * blue)}, 1)`);
        // let oldColor = polygon.material;
        let colors = [
            Cesium.Color.fromCssColorString(`rgba(${parseInt(256 * red)}, ${parseInt(256 * green)}, ${parseInt(256 * blue)}, 1)`),
            polygon.material,
        ];
        let time = 6;
        let id = setInterval(_ => {
            if (time) {
                polygon.material = colors[time % 2];
            } else {
                clearInterval(id);
            }
            time--;
        },500);
    }

    flyToLatLng(lat,lng,height) {
        this.viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(lng,lat, height || 35000.0),
            duration: 1,
        });
    }

    flyToDs(ds) {
        viewer.flyTo(ds);
    }

    flyTo(id) {
        this.viewer.flyTo(id);
    }

    createEntityAndCss3Rnederer() {
        let eAndc = {
            entity: window.mapHandle.createEntity(),
            css3Renderer: new Css3Renderer(this.viewer,true)
        };
        this._layerIds.entityAndCss3Rnederer.push(eAndc);
        return eAndc;
    }
    /**
     * @param entity        -- 由 createEntityAndCss3Rnederer 创建
     * @param _css3Renderer /
     * @param pointInfo = { title: "乌孜别克斯坦",long: 61.75, lat: 46.89 }
     * */
    createEchartDom(entity,_css3Renderer,pointInfo,style) {
        let obj = window.mapHandle.createEchartDom(entity,_css3Renderer,
            this.viewer,pointInfo,this._createId(),style);
        let ec = echarts.init(obj.echartElement);
        return {
            ...obj,
            ec
        };
    }
    createInformationDiv(entity,_css3Renderer,pointInfo,style) {
        let obj = window.mapHandle.createInformationDiv(entity,_css3Renderer,
            this.viewer,pointInfo,this._createId(),style);
        return obj;
    }
    // 传入参数为 createEntityAndCss3Rnederer 产生的对象
    removeEchart(entity,_css3Renderer) {
        // entity.show = false;
        this.viewer.entities.remove(entity);
        (entity._children || []).forEach(c => {
            this.viewer.entities.removeById(c.id);
        })
        _css3Renderer.destroy();
    }

    /**
     * 绑定点击方法，默认无绑定，目前只定义了左键单击事件(lclick)
     * @param lclick 表示左键单击
     *
     * 事件回调的参数为
     *      lclick({click,src,view,word,platform,map,wgs84,pick})
     *          click 为点击事件本体
     *          src、view、word、platform、map、wgs84 分别表示 原、视图、世界、平台、当前地图、wgs84 下的坐标值
     *          pick 表示是否点击到定义的实体，如果是改内容为实体，否则为 null
     */
    bindPickerMethod(lclick) {
        if (lclick) {
            window.handler.lclick(lclick)
        }
    }

    // 如果是载入新模块，需要在 removeAll 之后执行
    setBaseView(lng,lat,height,heading,pitch,roll) {
        lng = lng || 65;
        lat = lat || 45;
        height = height || 4000000;
        heading = heading || 6.2831853071795845;
        pitch = pitch || -1.57072018602691;
        roll = roll || 0;
        this.viewer.camera.setView({
            // 初始化相机经纬度
            destination: Cesium.Cartesian3.fromDegrees(lng,lat,height),//Cesium.Cartesian3.fromDegrees(65, 45, 4000000),
            orientation: {
                heading: heading,
                pitch: pitch, //从上往下看为-90
                roll: roll
            }
        })
    }

    // 恢复默认视图
    resetView() {
        this.viewer.camera.setView(this._baseView);
    }

    // 销毁全部内容，在使用新模块时调用
    removeAll() {
        this.drawer(false);
        this.resetView();
        this._layerIds.imageryProvider = this._layerIds.imageryProvider.filter(id => {
            for (let i = 0;i < this.viewer.imageryLayers._layers.length;i++) {
                if (this.viewer.imageryLayers._layers[i]._imageryProvider.id === id) {
                    this.viewer.imageryLayers.remove(this.viewer.imageryLayers._layers[i]);
                    return false;
                }
            }
            return true;
        });
        this._layerIds.datasource = this._layerIds.datasource.filter(ds => {
            return !this.viewer.dataSources.remove(ds);
        });
        this.viewer.dataSources.removeAll();
        this.removeTimelineLayer();
        this.hideImageLegend();
        this._magm.GraphicManager.removeAll();
        this._magm.MarkManager.removeAll();
        this._layerIds.dom = this._layerIds.dom.filter(d => {
            if (typeof d === 'string') {
                (document.getElementById(d) || {remove() {}}).remove();
            } else {
                d.remove();
            }
            return false;
        });
        this.setMapOnClickCallBack(()=>{});
        this._layerIds.entityAndCss3Rnederer = this._layerIds.entityAndCss3Rnederer.filter(eac => {
            this.removeEchart(eac.entity,eac.css3Renderer);
            return false;
        });
        if (this.pointEntity) {
            this.viewer.entities.remove(this.pointEntity);
            this.pointEntity.clearEntityChildren();
        };
        this.bindPickerMethod(()=>{});
        this.updateMagmMethod(this._nullMagmMethods);
        this._mapOnClickCallBack = ()=>{};
        this.panelCallback = {
            clearCallback() {}
        };
        if (this.clusterDataSource) {
            this.viewer.dataSources.remove(this.clusterDataSource)
        }

        return this;
    }

    // year = 2018
    // days = 4
    // 表示 2018 年的第 4 天
    setTime(year,days) {
        this.viewer.clock.currentTime = CesiumUtils.getJulianDateFromDayNumber(year,days);
    }

    createPointEntity() {
        this.pointEntity = new PointEntity(this.viewer);
        return this.pointEntity;
    }

    createPointEntityCluster(pixelRange,minimumClusterSize,{points,long,lat,label} = {}) {
        if (this.clusterDataSource) {
            this.viewer.dataSources.remove(this.clusterDataSource);
        }
        pixelRange = pixelRange || 50;
        minimumClusterSize = minimumClusterSize || 2;
        let name = `datasource_` + new Date().getTime() + '_' + parseInt(Math.random() * 1000);
        this.clusterDataSource = new Cesium.CustomDataSource(name);
        // this.clusterDataSource.entities.add(entity);
        this.viewer.dataSources.add(this.clusterDataSource);

        this.clusterDataSource.clustering.enabled = true; //是否聚合
        this.clusterDataSource.clustering.pixelRange = pixelRange; //聚合范围（单位px）
        this.clusterDataSource.clustering.minimumClusterSize = minimumClusterSize; //最小屏幕聚合对象数值（小于等于该数值，不聚合）

        let $this = this;
        let removeListener = null;
        function customStyle() {
            if (Cesium.defined(removeListener)) {
                removeListener();
                removeListener = undefined;
            } else {
                removeListener = $this.clusterDataSource.clustering.clusterEvent.addEventListener(
                    function (clusteredEntities, cluster) {
                        let firstEntity = clusteredEntities[0];

                        cluster.label.show = true;
                        cluster.label.text = clusteredEntities.length + ":" + firstEntity.label.text.getValue();
                        cluster.label.font = firstEntity.label.font.getValue();
                        cluster.label.fillColor = firstEntity.label.fillColor.getValue();
                        cluster.label.style = firstEntity.label.style.getValue();
                        cluster.label.outlineWidth = firstEntity.label.outlineWidth.getValue();
                        cluster.label.pixelOffset = firstEntity.label.pixelOffset.getValue();
                        cluster.label.verticalOrigin = firstEntity.label.verticalOrigin.getValue();

                        cluster.label.backgroundColor = firstEntity.label.backgroundColor.getValue();
                        cluster.label.horizontalOrigin = (firstEntity.label.horizontalOrigin||{getValue(){
                                return Cesium.HorizontalOrigin.CENTER;
                            }}).getValue();
                        // cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                        cluster.label.showBackground = firstEntity.label.showBackground.getValue();
                        // cluster.label.showBackground = true;
                        cluster.point.color = firstEntity.point.color.getValue();
                        cluster.point.pixelSize = firstEntity.point.pixelSize.getValue();
                        cluster.point.outlineColor = firstEntity.point.outlineColor.getValue();
                        cluster.point.outlineWidth = firstEntity.point.outlineWidth.getValue();
                        cluster.point.id = cluster.label.id;
                        cluster.point.show = true;
                    }
                );
            }
        }
        customStyle();
        if (points) {
            points.forEach(item => {
                $this.clusterDataSource.entities.add(PointEntity.createPointEntity(+item[long],+item[lat],item[label]));
            });
        }
        return this;
    }

    CVT() {
        return CVT;
    }

    showCurrentPoint() {
        console.log(CVT.cartesian2Wgs84(this.viewer.camera.position,this.viewer));
    }

    // str = #7f7fde
    createColor(str) {
        return Cesium.Color.fromCssColorString(str);
    }

    addPolygonGeoJSON(geojsonUrl,defaultFillColor,alpha) {
        let $this = this;
        var promise=Cesium.GeoJsonDataSource.load(geojsonUrl,{clampToGround: true});
        let defaultFillColr = defaultFillColor ? Cesium.Color.fromCssColorString(defaultFillColor) : null;
        alpha = alpha || 1.0;
        promise.then(function(dataSource) {
            let t = $this.viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            var colorHash = {};
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = entity.name;
                let color = defaultFillColr ? defaultFillColr : Cesium.Color.fromRandom({
                    alpha: alpha
                });
                if (entity.properties.COLOR && entity.properties.COLOR._value) {
                    color = Cesium.Color.fromCssColorString(entity.properties.COLOR._value);
                }
                entity.polygon.material = color;
                if (entity.properties.LABEL && entity.properties.LABEL._value){
                    var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                    var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;//中心点
                    polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                    entity.position = polyCenter;
                    entity.label={
                        // position:
                        text: entity.properties.LABEL._value,
                        color : Cesium.Color.fromCssColorString('#fff'),
                        font:'normal 32px MicroSoft YaHei',
                        showBackground : true,
                        scale : 0.5,
                        horizontalOrigin : Cesium.HorizontalOrigin.LEFT_CLICK,
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance : 10000.0
                    };
                }

                // entity.polygon.outline = false;
                // entity.polygon.extrudedHeight =50.0;
            }
            // this._layerIds.datasource.push(dataSource);
        });
        this.viewer.flyTo(promise);
    }
}