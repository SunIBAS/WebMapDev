const AddMarker = (new class{
    constructor(viewer) {
        this.viewer = viewer;
    }

    // 添加图片标记
    addImageMarker(name,c3,imgSrc) {
        var enetity = this.viewer.entities.add({
            name,
            position: c3,
            billboard:{
                image: imgSrc,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 1,
            }
        })
    }

    addMarker(name,c3,imgSrc,text,id) {
        viewer.entities.add(Object.assign({
            id: id || "id_" + (new Date().getTime()),//站点id
            name,
            position: c3,
            label: {
                fillColor: Cesium.Color.BLACK,
                text:  text,
                font:'normal 16px MicroSoft YaHei',
                showBackground: true,
                backgroundColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // outlineWidth: 1,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset : new Cesium.Cartesian2(0.0,-25),
                pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
            }
        },imgSrc ? {
            billboard:{
                // position:Cesium.Cartesian3.fromDegrees(Number(data.datas[i].lat),Number(data.datas[i].lng),10),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                image: imgSrc,
                height: 40,
                width: 30
            }
        } : {}));
    }
})