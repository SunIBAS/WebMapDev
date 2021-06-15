/* 地图处理 | yangjianzhi 20200828 */
window.mapHandle = (function () {
    function _createId() {
        return `${new Date().getTime()}_${parseInt(Math.random() * 1000)}`;
    }
    //绘制图形方法
    var DrawHelper = (function () {
        'use strict';

        var m_viewer;

        var _ = {};

        //初始
        _.initialViewer = function (viewer) {
            m_viewer = viewer;
        };

        //*********基础实体

        //创建实体
        _.createEntity = function(id){
            return new Cesium.Entity({ id: id });
        };

        //获取点
        _.getPoint = function(opt) {
            return new Cesium.PointGraphics({
                color: opt["color"] || Cesium.Color.GREEN,
                pixelSize: opt['pixelSize'] || 5,
                outlineColor: opt["outlineColor"] || Cesium.Color.WHITE,
                outlineWidth: opt["outlineWidth"] || 1
            });
        };

        //获取文本
        _.getLabel = function(opt) {
            return new Cesium.LabelGraphics({
                text: opt["text"] || "",
                font: opt["font"] || " 15px KaiTi ",
                fillColor: opt["fillColor"] || Cesium['Color']['GOLD'],
                style: opt["style"] || Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: opt["outlineWidth"] || 2,
                showBackground: opt["showBackground"] || false,
                backgroundColor: opt["backgroundColor"] || new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                verticalOrigin: opt["verticalOrigin"] || Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: opt["pixelOffset"] || new Cesium.Cartesian2(0, -10)
            });
        };

        //*********基础实体扩展

        //获取黑底文字和点
        _.createBlackBackgroundLabel = function (cartesian, text, id,addToMap) {
            var entity = this.createEntity(id);

            //获取黑底文字
            var label = this.getLabel({
                text: text,
                fillColor: Cesium.Color.fromCssColorString("#ffffff"),
                showBackground: true,
                backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString("#000000"), 0.5),
            });
            label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            label.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;

            //点
            var point = this.getPoint({});

            entity.point = point;
            entity.label = label;
            entity.position = cartesian;
            addToMap = typeof addToMap === 'boolean' ? addToMap : false;
            return addToMap ? m_viewer.entities.add(entity) : entity;
        };

        //*********其它特殊

        return _;
    }());
    //创建点
    // dataList = { title: "乌孜别克斯坦", key: "1" ,long: "61.75", lat: "46.89" }
    // longKey = long
    // latKey = lat
    // labelKey = title
    // parentEntity = createEntity
    // type = 只是一个标记
    function createPoint(dataList, longKey, latKey,labelKey , parentEntity, type) {
        for (var i = 0; i < dataList.length; i++) {
            var info = dataList[i];
            if (info && info[longKey] && info[latKey]) {
                var long = info[longKey],
                    alt = info[latKey],
                    title = info[labelKey];

                if (long && alt) {
                    var cartesian = Cesium.Cartesian3.fromDegrees(long, alt);
                    var entity = null;
                    if (title) {
                        entity = DrawHelper.createBlackBackgroundLabel(cartesian, title, "entity_" + title);
                    } else {
                        entity = DrawHelper.createBlackBackgroundLabel(cartesian, title, "entity_" + _createId());
                    }
                    entity.properties = info; //关联信息

                    if (parentEntity) entity.parent = parentEntity;
                    if (type) entity.entityType = type;
                }
            }
        }
    }

    //高亮
    function highlightEntity(entity, parentEntity) {
        if (Cesium.defined(parentEntity)) {
            if (parentEntity && parentEntity._children && parentEntity._children.length > 0) {
                parentEntity._children.forEach(function (value) {
                    value.label.fillColor.setValue(Cesium.Color.fromCssColorString("#ffffff"));
                });
            }
        }
        if (Cesium.defined(entity)) {
            entity.label.fillColor.setValue(Cesium.Color.fromCssColorString("#00ffd0"));
        }
    }

    //跳转到对象位置
    function flytoByEntityProperties(entity) {
        var properties = entity.properties.getValue();
        window.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(properties["long"], properties["lat"], 35000.0),
            duration: 1,
        });
    }

    //创建一个父图形
    function createEntity() {
        return window.viewer.entities.add(new Cesium.Entity());
    }

    //清除图形下的子图形
    function clearEntityChildren(entity) {
        if (entity && entity._children && entity._children.length > 0) {
            entity._children.forEach(function (value) {
                window.viewer.entities.remove(value);
            });
        }
    }

    // 创建 echart
    function createEchartDom(entity,_css3Renderer,viewer,{long,lat,title},id,style,noPoint) {
        // let _css3Renderer = new Css3Renderer(viewer,true);
        // let entity = createEntity();
        if (!noPoint) createPoint([{long,lat,title}],'long','lat','title',entity);
        style = Object.assign({
            width: '100px',
            height: '60px',
            "background-color": '#ffffff',
            display: 'none'
        },style || {});
        let styleStr = '';
        for (let i in style) {
            styleStr += `${i}: ${style[i]};`;
        }
        _css3Renderer.addEntityLayer({
            id: id,
            position: [long,lat, 200],//高度为 boxHeightMax
            element: `<div class="ys-css3-box">
                        <div id="${id}" style="${styleStr}"></div>
                   </div>`,
            offset: [ -50 ,10],
            boxShow: false,
            circleShow: false
        });
        let echartElement = document.getElementById(id);
        return {
            entity,
            _css3Renderer,
            echartElement
        }
    }
    function createInformationDiv(entity,_css3Renderer,viewer,{long,lat,title},id,style,noPoint) {
        if (!noPoint) createPoint([{long,lat,title}],'long','lat','title',entity);
        style = Object.assign({
            width: '100px',
            height: 'auto',
            "background-color": '#ffffff',
            display: 'none'
        },style || {});
        let styleStr = '';
        for (let i in style) {
            styleStr += `${i}: ${style[i]};`;
        }
        _css3Renderer.addEntityLayer({
            id: id,
            position: [long,lat, 200],//高度为 boxHeightMax
            element: `<div class="ys-css3-box">
                        <div id="${id}" style="${styleStr}"></div>
                   </div>`,
            offset: [ -50 ,10],
            boxShow: false,
            circleShow: false
        });
        let echartElement = document.getElementById(id);
        return {
            entity,
            _css3Renderer,
            echartElement
        }
    }
    // 结合 createEchartDom 函数使用的，这里的 title 和 createEchartDom中的title 是同一个内容
    function flyToEchartPoint(title) {
        var entity = window.viewer.entities.getById("entity_" + title);
        if (Cesium.defined(entity)) {
            flytoByEntityProperties(entity);
            highlightEntity(entity, siteParentEntity);
        }
    }

    return {
        DrawHelper,
        createPoint,
        highlightEntity,
        flytoByEntityProperties,
        createEntity,
        clearEntityChildren,
        // 下面两个是二次封装的
        createEchartDom,
        createInformationDiv,
        flyToEchartPoint,
    }
})();