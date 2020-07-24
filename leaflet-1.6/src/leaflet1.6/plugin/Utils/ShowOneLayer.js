function ShowOneLayer() {
    let map = null;
    return {
        init(_map) {
            map = _map;
            return this;
        },
        showLayer(url,param,cb) {
            cb = () => {};
            let lay = L.tileLayer.wms(url, JSON.parse(param),true)
                .addTo(map)
                .on('load',cb);
            return this;
        }
    }
}