# cesium

该项目使用的是 cesium 1.71 版本

### src/MySeal 文件夹中的文件说明

这个文件夹下是我自己封装的一些代码功能分别如下

> Basemap.js
>> 为地图添加底图，目前提供了 ```addWMS``` 和 ```addXYZ``` 两个方法，需要再补充，使用方法和效果如下

![](./images/tl_baseMap.jpg)

```javascript
addBaseMap.addXYZ(
        'http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga',
        'Google',
        'Google',
        './../src/MySeal/images/google.jpg')
    .addWMS(
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
    );
// 这里不考虑动态添加的问题好像也没必要，需要的可以自己修改代码
var viewer = new Cesium.Viewer("cesiumContainer",{
    // 添加地图
    ...addBaseMap.output()
});
```

> BaseMapGroupManager.js
>> 这个是在地图的右上角添加一些图层，包括底图和基础图层选择，目前不知道如何修改，必须要将 必应 作为默认地图

![](./images/tl_baseMapManager.jpg)

```javascript
let bmgmc = new MyDefault_BaseMapGroupManager_Setting(document.body, 'cesiumContainer');

// 这里的 MyDefault_BaseMapGroupManager_Setting 是我项目中的默认图层的默认写法
// BaseMapGroupManager.tar.base 指的是添加底图（只能显示一个）
// BaseMapGroupManager.tar.option 指的是添加基础图层（可以显示多个，显示位置高于底图）
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
    )//继续编写 addXYZ 和 add WMS 添加图层
    .apply()
```

> setBaseView.js
>> 这个只是简单的对地图做简单的设置

> TimeLine.js
>> 这个是时间线的修改，因为我的项目需要

>> 我的需求是显示一年的数据，而一年每 8 天只有一期数据，并且通过 layers 参数来索引影像

>> 这里有一个 bug 就是，时间条上的日期偶尔是中文偶尔是英文，不知道为什么

![](./images/ll_clock_timeline.jpg)

```javascript
// m 年的第 n 期
// service: WMS
// layers: vhi_{m}_{n}
// styles: draught:vhi
// transparent: true
// format: image/png
// 使用方法如下
// 从 2018-01-01 到 2018-12-31
// 每 8 天一期
new TimeLine(viewer, '2018-01-01', '2018-12-31',
    'http://10.10.1.132:8080/geoserver/draught/wms', {
        styles: 'draught:vhi',
        service: 'WMS',
        transparent: true,
        format: 'image/png'
    },
    function ({
        year,
        month,
        day,
        dd // 对应闰年是 (1~366) 平年是 (1~365)
    }) {
        // 每 8 天一期，这里将天数对 8 求商取整
        // 如果有需要这里可以附加其他参数去覆盖例如 { layers,styles }
        return {
            layers: `vhi_${year}_${parseInt(dd / 8) + 1}`
        };
    }).init()
    .UTC(); // <- 这个是将日期变成中文，不需要可以不要
```

### 简单入门

[BaseMap](./example/BaseMap.html)

```javascript
<script src="../src/MySeal/Basemap.js"></script>
<script src="../src/MySeal/setBaseView.js"></script>
var viewer = new Cesium.Viewer("cesiumContainer",{
    ...addBaseMap.output()
});
```

![](./images/BaseMap.jpg)

### 测试图层管理

[BaseMapGroupManager](./example/BaseMapGroupManagerTest.html)

![](./images/BaseMapGroupManager.jpg)

### 测试时间线

[TimeLine](./example/TimeLine.html)

![](./images/TimeLine.jpg)
