const addBaseMap = (new class {
    constructor(props) {
        this.baseMap = [];
    }

    addXYZ(url,name,tip,icon) {
        var myProviderViewModel = new Cesium.ProviderViewModel({
            name: name,
            tooltip: tip,
            iconUrl: icon,
            creationFunction: function () {
                var provider = new Cesium.UrlTemplateImageryProvider({
                    UrlTemplateImageryProvider: false,
                    url: url
                });
                return provider;
            }
        });
        this.baseMap.push(myProviderViewModel);
        return this;
    }

    addWMS(url,layers,parameters,name,tip,icon) {
        var myProviderViewModel = new Cesium.ProviderViewModel({
            name,
            tooltip: tip,
            iconUrl: icon,
            creationFunction: function () {
                var provider = new Cesium.WebMapServiceImageryProvider({
                    enablePickFeatures: false,
                    url: url,
                    layers : layers,
                    parameters
                });
                return provider;
            }
        });
        this.baseMap.push(myProviderViewModel);
        return this;
    }

    output() {
        return {
            selectedImageryProviderViewModel: this.baseMap[0],
            imageryProviderViewModels: this.baseMap,
        }
    }
});

addBaseMap.addWMS(
        'http://10.10.1.132:8080/geoserver/ditu/wms',
        `ditu:google3857`,
        {
            service : 'WMS',
            transparent: true,
            format: 'image/png'
        },
        "中亚无云遥感TM 30m",
        "中亚无云遥感TM 30m",
        './../src/MySeal/images/vswi.jpg'
    ).addXYZ(
    'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga',
    'Google',
    'Google',
    './../src/MySeal/images/google.jpg');