class PickFeature {
    static defaultShowPop = {
        // 使用方法 PickFeature.defaultShowFn.draught.bind(null,addPopPanel)
        "draught"(addPopPanel,c2,data) {
            // 针对干旱指数
            addPopPanel(c2,{
                info:data[0].data.properties.GRAY_INDEX
            })
        }
    }
    constructor(viewer, showPop, provider) {
        this.viewer = viewer;
        this.showPop = showPop || ((cartesian2, data) => {});
        // this.showPop = function (c2,data) {
        //     mgm.addPopPanel(c2,{info:data[0].data.properties.GRAY_INDEX})
        // }
        this.provider = provider;
    }

    query(position) {
        if (this.provider) {
            const ray = this.viewer.camera.getPickRay(position);
            const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            let $this = this;
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                if (cartographic) {
                    var xy = new Cesium.Cartesian2();
                    var alti = this.viewer.camera.positionCartographic.height;
                    var level = this.getLevel(alti);
                    if (this.provider.ready) {
                        xy = this.provider.tilingScheme.positionToTileXY(cartographic, level, xy);
                        var promise = this.provider.pickFeatures(xy.x, xy.y, level, cartographic.longitude, cartographic.latitude);
                        Cesium.when(promise, function (data) {
                            $this.showPop(position, data);
                        });
                    }
                }
            }
        }
    }

    getLevel(height) {
        if (height > 48000000) {
            return 0;
        } else if (height > 24000000) {
            return 1;
        } else if (height > 12000000) {
            return 2;
        } else if (height > 6000000) {
            return 3;
        } else if (height > 3000000) {
            return 4;
        } else if (height > 1500000) {
            return 5;
        } else if (height > 750000) {
            return 6;
        } else if (height > 375000) {
            return 7;
        } else if (height > 187500) {
            return 8;
        } else if (height > 93750) {
            return 9;
        } else if (height > 46875) {
            return 10;
        } else if (height > 23437.5) {
            return 11;
        } else if (height > 11718.75) {
            return 12;
        } else if (height > 5859.38) {
            return 13;
        } else if (height > 2929.69) {
            return 14;
        } else if (height > 1464.84) {
            return 15;
        } else if (height > 732.42) {
            return 16;
        } else if (height > 366.21) {
            return 17;
        } else {
            return 18;
        }
    }
}