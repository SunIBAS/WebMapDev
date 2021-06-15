const CesiumUtils = (function() {
    /**
     * @param yyyyMMdd 2018-1-1
     * */
    function getDate(yyyyMMdd) {
        let d = new Date(yyyyMMdd);
        d.setMilliseconds(0);
        d.setSeconds(0);
        d.setMinutes(0);
        d.setHours(0);
        return d;
    }
    function getJulianDate(yyyyMMdd) {
        return Cesium.JulianDate.fromDate(getDate(yyyyMMdd));
    }
    function getJulianDateFromDayNumber(year,dn) {
        let d = new Date(year + "-1-1");
        d.setTime(d.getTime() + dn * 1000 * 3600 * 24);
        return Cesium.JulianDate.fromDate(d);
    }
    // startTime 是时间戳
    function julianIntToDate(JD,startTime) {
        var y = 4716;
        var v = 3;
        var j = 1401;
        var u =  5;
        var m =  2;
        var s =  153;
        var n = 12;
        var w =  2;
        var r =  4;
        var B =  274277;
        var p =  1461;
        var C =  -38;
        var f = JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
        var e = r * f + v;
        var g = Math.floor((e % p) / r);
        var h = u * g + w;
        var D = Math.floor((h % s) / u) + 1;
        var M = ((Math.floor(h / s) + m) % n) + 1;
        var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n) ;
        // M++;
        let date = new Date(Y,M - 1,D);
        startTime = startTime || new Date(Y + "-1-1").getTime();
        let day = parseInt((date.getTime() - startTime) / 3600 / 24 / 1000) + 1;

        return {
            Y,
            M,
            D,
            date,
            day
        };
    }

    function getCurrentExtent(viewer) {
        // 范围对象
        var extent = {};

        // 得到当前三维场景
        var scene = viewer.scene;

        // 得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var canvas = scene.canvas;

        // canvas左上角
        var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);

        // canvas右下角
        var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);

        // 当canvas左上角和右下角全部在椭球体上
        if (car3_lt && car3_rb) {
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
        }

        // 当canvas左上角不在但右下角在椭球体上
        else if (!car3_lt && car3_rb) {
            var car3_lt2 = null;
            var yIndex = 0;
            do {
                // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                yIndex <= canvas.height ? yIndex += 10 : canvas.height;
                car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
            } while (!car3_lt2);
            var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
            var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
            extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
        }

        // 获取高度
        extent.height = Math.ceil(viewer.camera.positionCartographic.height);
        return {
            up: extent.ymin,
            down: extent.ymax,
            left: extent.xmin,
            right: extent.xmax,
            height: extent.height
        };
    }
    return {
        getCurrentExtent,
        getJulianDate,
        getJulianDateFromDayNumber,
        julianIntToDate,
        degreeToDMS(deg) {
            // 46.18820280032149
            let d = parseInt(deg);
            let t = (deg - d) * 60;
            let m = parseInt(t);
            t = (t - m) * 60;
            let s = parseInt(t);
            return `${d}°${m}′${s}″`;
        },
        // extent = {up:1,dowm:0,left:1,right:0}
        flyToExtent(extent,viewer) {
            var rectangle = Cesium.Rectangle.fromDegrees(extent.left * 0.99, extent.up * 1.01,extent.right * 1.01, extent.down * 0.99);
            if (extent.height) {
                rectangle.height = extent.height;
            }
            viewer.camera.flyTo({
                destination : rectangle
            });
        },
        getCurrentCenter() {
            window.__temp__center__ = CVT.cartesian2Wgs84(window.viewer.camera._position,window.viewer);
            console.log(`window.__temp__center__ = \r\n${JSON.stringify(window.__temp__center__,'','\t')}`);
            console.log(`Cesium.Cartesian3.fromDegrees(${window.__temp__center__.y}, ${window.__temp__center__.x}, ${window.__temp__center__.height})`)
        }
    }
})();