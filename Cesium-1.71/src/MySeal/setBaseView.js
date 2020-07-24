function setBaseView(viewer) {
    viewer.scene.camera.setView({
        // 初始化相机经纬度
        destination: Cesium.Cartesian3.fromDegrees(65, 45, 4000000),
        orientation: {
            heading: 6.2831853071795845,
            pitch: -1.57072018602691, //从上往下看为-90
            roll: 0
        }
    });
}