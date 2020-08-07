class AddFeatureOrOWS {
    constructor(viewer,GraphicManager,MarkManager,flash,{
        flashColor,
        polygonFillColor,
        polygonOutlineColor,
        polylineColor,
    }) {
        this.viewer = viewer;
        this.MarkManager = MarkManager;
        this.GraphicManager = GraphicManager;
        this.tmpFeature = null;
        this.flash = flash;
        this.flashColor = flashColor || "rgb(0, 191, 255)";
        this.polygonDefaultStyle = {
            material: polygonFillColor || new Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
            outline: true,
            outlineColor: polygonOutlineColor || new Cesium.Color.fromCssColorString('rgba(255,247,145,1)'),
            outlineWidth: 2,
            perPositionHeight: false
        }
        this.polylineDefaultStyle = {
            clampToGround: true,
            material: polylineColor || new Cesium.Color.fromCssColorString('rgb(58, 137, 221)'),
            width: 3
        };
    }

    // todo 未测试
    addOWSPolygon(url,flash,flashColor,_defaultStyle) {
        let $this = this;
        // 默认为 true
        flash = flash ? true : (typeof flash === "boolean" ? false : true);
        flashColor = flashColor || this.flashColor;
        let tar = "_polygon";
        let addFn = this.GraphicManager.addPolygon.bind(this.GraphicManager);
        let defaultStyle = Object.assign({},this.polygonDefaultStyle,(_defaultStyle||{}));
        Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            dataSource.entities.values.forEach(function (entity,id) {
                let ps = [[]];
                if (!window.tmpEntity) {
                    window.tmpEntity = [];
                }
                window.tmpEntity.push(entity);
                // entity.polygon.hierarchy._value.positions.forEach(p => ps[0].push(CVT.cartesian2Wgs84(p,$this.viewer)));
                // // console.log(entity.polygon.hierarchy._value.holes)
                // entity.polygon.hierarchy._value.holes.forEach(h => {
                //     let hs = [];
                //     h.positions.forEach(p => hs.push(CVT.cartesian2Wgs84(p,$this.viewer)));
                //     ps.push(hs);
                // })
                // let pro = {};
                // dataSource.entities.values[0]._properties.propertyNames.forEach(ns => {
                //     pro[ns] = dataSource.entities.values[0]._properties[ns]._value;
                // });
                // if (flash) {
                //     pro['_flash_'] = 1;
                //     pro['_flash_color_'] = Cesium.Color.fromCssColorString(flashColor);
                // } else {
                //     pro['_flash_'] = 0;
                // }
                // pro = {
                //     properties: pro,
                //     defaultStyle
                // };
                // addFn(ps,
                //     "name" in pro ? pro.name : "name_" + id,
                //     pro)
            });
        });
    }

    addOWSPolyline(url,flash,flashColor,_defaultStyle){
        let $this = this;
        // 默认为 true
        flash = flash ? true : (typeof flash === "boolean" ? false : true);
        flashColor = flashColor || this.flashColor;
        let defaultStyle = Object.assign({},this.polylineDefaultStyle,(_defaultStyle||{}));

        Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
            dataSource.entities.values.forEach(function (entity,id) {
                // if (!window.tmpEntity) {
                //     window.tmpEntity = [];
                // }
                // window.tmpEntity.push(entity);
                entity.properties.addProperty("__flash_color_");
                entity.properties.addProperty("_flash_");
                entity.properties.__flash_color_ = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(flashColor));
                entity.properties._flash_ = new Cesium.ConstantProperty(flash ? 1 : 0);
                entity.polyline.material = defaultStyle.material;
                entity.polyline.width = defaultStyle.width;
                entity.polyline.clampToGround = defaultStyle.clampToGround;
                $this.GraphicManager.importByEntity(entity,'line');
            });
        });
    }

    addOWS(url,type,flash,defaultColor,flashColor) {
        let $this = this;
        type = type || "line";
        // 默认为 true
        flash = flash ? true : (typeof flash === "boolean" ? false : true);
        flashColor = flashColor || this.flashColor;
        let tar = type === "line" ? "_polyline" : "_polygon";
        let addFn = () => {};
        let defaultStyle = {};
        if (type === "polygon") {
            addFn = this.GraphicManager.addPolygon.bind(this.GraphicManager);
            defaultStyle = {};
        } else if (type === "line") {
            addFn = this.GraphicManager.addPolyline.bind(this.GraphicManager);
            defaultStyle = {
                clampToGround: true,
                material: Cesium.Color.fromCssColorString(defaultColor),
                width: 3
            };
        }
        Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
            dataSource.entities.values.forEach(function (entity,id) {
                let ps = [];
                entity[tar].positions._value.forEach(p => ps.push(CVT.cartesian2Wgs84(p,$this.viewer)));
                let pro = {};
                dataSource.entities.values[0]._properties.propertyNames.forEach(ns => {
                    pro[ns] = dataSource.entities.values[0]._properties[ns]._value;
                });
                if (flash) {
                    pro['_flash_'] = 1;
                    pro['_flash_color_'] = Cesium.Color.fromCssColorString(flashColor);
                } else {
                    pro['_flash_'] = 0;
                }
                pro = {
                    properties: pro,
                    defaultStyle
                };
                addFn(ps,
                    "name" in pro ? pro.name : "name_" + id,
                    pro)
            });
        });
    }

    // 发布为 wms 的 shp 文件在经过
    // datas 是点击请求回来的内容
    // datas = {
    //     "type": "FeatureCollection",
    //     "features": [{
    //         "type": "Feature",
    //         "id": "urganch2019.894638",
    //         "geometry": {
    //             "type": "MultiPolygon",
    //             "coordinates": [[[[60.65697674, 41.75920149], [60.65662805, 41.75912639], [60.65631155, 41.75963064], [60.65610234, 41.75979694], [60.65602724, 41.75989887], [60.65622572, 41.7599686], [60.65654758, 41.76001688], [60.65722887, 41.76024755], [60.65786723, 41.76041922], [60.65806035, 41.76044067], [60.65859143, 41.75972721], [60.65856461, 41.75968429], [60.65850023, 41.7596682], [60.65810327, 41.75957164], [60.65766338, 41.75941607], [60.65724496, 41.75930878], [60.65697674, 41.75920149]]]]
    //         },
    //         "geometry_name": "the_geom",
    //         "properties": {"MAX": 2, "area": 17026.49460766877}
    //     }],
    //     "totalFeatures": "unknown",
    //     "numberReturned": 1,
    //     "timeStamp": "2020-08-04T07:20:12.945Z",
    //     "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4326"}}
    // }
    addPolygonShpGetInfo(feature,filterProp) {
        filterProp = filterProp || (_ => _);
        this.MarkManager.clearAllSelfPopDom();
        if (this.tmpFeature) {
            this.tmpFeature.remove();
        }
        let ps = [];
        let center = {
            west: -1,
            sourth: -1,
            east: -1,
            north: -1,
            lat: 0,
            lng: 0,
        };
        // 不管如何，只要显示第一个，我不管了
        if (feature.geometry.type === "MultiPolygon") {
            center.north = center.sourth = feature.geometry.coordinates[0][0][0][1];
            center.east = center.west = feature.geometry.coordinates[0][0][0][0];
            feature.geometry.coordinates[0][0].forEach(p => {
                ps.push({
                    lng: p[0],
                    lat: p[1]
                });
                // center.lng += p[0];
                // center.lat += p[1];
                // 越西越小，越北越大
                center.north = center.north < p[1] ? p[1] : center.north;
                center.sourth = center.sourth > p[1] ? p[1] : center.sourth;
                center.west = center.west > p[0] ? p[0] : center.west;
                center.east = center.east < p[0] ? p[0] : center.east;
            });
            center.lat = (center.north + center.sourth) / 2;
            center.lng = (center.west + center.east) / 2;
            center.sourth -= Math.abs(center.lat) * 0.00001;
            center.north += Math.abs(center.lat) * 0.00001;
            center.west -= Math.abs(center.lng) * 0.00001;
            center.east += Math.abs(center.lng) * 0.00001;
        } else {
            throw new Error("未定义类型");
        }
        let pro = feature.properties;
        pro = {
            properties: pro,
            defaultStyle: this.polygonDefaultStyle
        };
        this.tmpFeature = this.GraphicManager.addPolygon(ps,"tmp",pro);
        this.flash.polygon({id: this.tmpFeature.graphic},4,Cesium.Color.fromCssColorString(this.flashColor));
        this.MarkManager.createSelfControlPopDom(Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 0),filterProp(feature.properties));

        var rectangle = Cesium.Rectangle.fromDegrees(center.west, center.sourth,center.east, center.north);

        this.viewer.camera.flyTo({
            destination : rectangle
        });

        window._center = center;
    }
}