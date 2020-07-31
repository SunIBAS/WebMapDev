function setBaseView(viewer,optioins) {
    if (typeof viewer == "string") {
        window.viewer = viewer = new Cesium.Viewer(viewer, Object.assign({
            geocoder: false,  // 隐藏查找位置工具
            homeButton:false, // 隐藏视角返回初始位置
            sceneModePicker:false, //隐藏选择视角的模式
            baseLayerPicker:false, //隐藏图层选择器
            fullscreenButton:true,//隐藏全屏按钮
            navigationHelpButton:false, //隐藏帮助按钮
            selectionIndicator: false,
            infoBox: false,
        },(optioins || {})));
    }

    viewer.scene.camera.setView({
        // 初始化相机经纬度
        destination: Cesium.Cartesian3.fromDegrees(65, 45, 4000000),
        orientation: {
            heading: 6.2831853071795845,
            pitch: -1.57072018602691, //从上往下看为-90
            roll: 0
        }
    });
    setTimeout(function () {
        viewer._cesiumWidget._creditContainer.parentNode.removeChild(viewer._cesiumWidget._creditContainer); //去掉版权信息
        let toggle = document.getElementsByClassName('cesium-animation-rectButton');
        if (toggle.length === 4) {
            toggle[0].remove();
        }
    },100);

    // 右下加的图例显示
    window.ImageLegend = (new class {
        constructor(option) {
            this.divId = "imageLegendId_div_" + (new Date().getTime());
            this.imageLegendId = "imageLegendId_" + (new Date().getTime());
            this.imageLegendDom = null;
            this.divDom = null;
            this.option = Object.assign({
                imageMaxWidth: "130px",
                imageMaxHeight: 0,
                bottom: 0
            },(option || {}));
            this.bottom = {
                none: {
                    bottom: "0px"
                },
                // 如果有时间轴推荐高度
                timeline: {
                    bottom: "30px"
                },
                // 如果有比例尺推荐高度
                zoom: {
                    bottom: "67px"
                }
            };
        }

        init (imgSrc) {
            imgSrc = imgSrc || "";
            if (this.imageLegendDom) {
                this.imageLegendDom.style.display = "block";
                this.imageLegendDom.src = imgSrc;
                // 已经在了，只需要修改图片
            } else {
                document.head.innerHTML += `<style>
                   #${this.divId} {
                        position: absolute;
                        bottom: 0;
                        padding: 4px 4px 1px;
                        font: 14px/16px Arial, Helvetica, sans-serif;
                        background: white;
                        background: rgba(255,255,255,0.8);
                        box-shadow: 0 0 15px rgba(0,0,0,0.2);
                        border-radius: 5px;
                        right: 5px;
                    }
                </style>`;
                this.divDom = (function() {
                    let div = document.createElement('div');
                    div.id = this.divId;
                    div.style.display = "none";
                    this.imageLegendDom = document.createElement('img');
                    this.imageLegendDom.id = this.imageLegendId;
                    this.imageLegendDom.src = imgSrc || "";
                    div.append(this.imageLegendDom);
                    setTimeout(() => {
                        div.style.display = "block";
                    },1000);
                    return div;
                }).bind(this)();
                viewer._container.parentNode.append(this.divDom);
            }
            if (!imgSrc) {
                this.imageLegendDom.style.display = "none";
            }
            this.updateOption({});
            return this;
        }

        updateOption(option) {
            this.option = Object.assign(this.option,(option || {}));
            this.imageLegendDom.style.maxWidth = this.option.imageMaxWidth ? this.option.imageMaxWidth : "unset";
            this.imageLegendDom.style.maxHeight = this.option.imageMaxHeight ? this.option.imageMaxHeight : "unset";
            this.divDom.style.bottom = this.option.bottom ? this.option.bottom : "0";
            return this;
        }
    }).init("http://10.10.1.132:8081/table/image/DRAUGHT_AVI.jpg");
    ImageLegend.updateOption(ImageLegend.bottom.zoom);

    // 坐标投影
    let transformLocation = (function (viewer) {
        var ellipsoid=viewer.scene.globe.ellipsoid;
        return {
            c3LatLng(cartesian3) {
                var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
                var lat=Cesium.Math.toDegrees(cartographic.latitude);
                var lng=Cesium.Math.toDegrees(cartographic.longitude);
                var alt=cartographic.height;
                console.log(`lat=${lat},lng=${lng},alt=${alt}`);
                return {
                    lat,
                    lng,
                    alt,
                    // todo 暂时随便写的
                    x: lat,
                    y: lng
                }
            }
        }
    })(viewer);
    // 点击事件
    window.handler = (function () {
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        let lclick = () => {};
        handler.setInputAction(function(click){
            let map = viewer.scene.globe.pick(viewer.camera.getPickRay(click.position), viewer.scene);
            lclick({
                src: click.position,
                // dom 节点上的位置
                view: viewer.scene.pick(click.position),
                word: viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid),
                platform: viewer.scene.pickPosition(click.position),
                // 可以绘制到地图的对应位置
                map: map,
                // wgs84 的坐标，可以和后台交互
                wgs84: transformLocation.c3LatLng(map)
            });
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return {
            lclick(cb) {
                lclick = cb;
            }
        }
    })();
    // handler.lclick(p => {
    //     window.p = p;
    //     var pinBuilder = new Cesium.PinBuilder();
    //     var entity=viewer.entities.add({
    //         id: "id_" + (new Date().getTime()),//站点id
    //         name:"air",
    //         position: p.map,
    //         billboard:{
    //             // position:Cesium.Cartesian3.fromDegrees(Number(data.datas[i].lat),Number(data.datas[i].lng),10),
    //             verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
    //             image:'./../src/MySeal/images/station.png',
    //             height: 40,
    //             width: 30
    //         },
    //         label: {
    //             fillColor: Cesium.Color.BLACK,
    //             text:  "中文新疆id_" + (new Date().getTime()),
    //             font:'normal 16px MicroSoft YaHei',
    //             showBackground: true,
    //             backgroundColor: Cesium.Color.WHITE,
    //             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    //             // outlineWidth: 1,
    //             horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //             verticalOrigin: Cesium.VerticalOrigin.TOP,
    //             pixelOffset : new Cesium.Cartesian2(0.0,-25),
    //             pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
    //         }
    //     });
    // });

    return viewer;
}