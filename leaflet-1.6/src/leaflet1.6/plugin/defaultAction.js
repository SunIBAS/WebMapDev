// target 例如 marker、map、drawer
// type 例如 click、move、hover
window.$emit = function(msg,target,type,others) {
    others = others || {};
    window.parent.postMessage("_map_" + JSON.stringify({
        data:msg,
        target,
        type,
        ...others
    }), '*');
}
//
setTimeout(function () {
    document.head.innerHTML += `<style>
.info {
    padding: 4px 4px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: white;
    background: rgba(255,255,255,0.8);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 5px;
}
 .legend {
    line-height: 18px;
    color: #555;
}
</style>`
},100);
function addLegend(map,img) {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var divDom = document.createElement("div");
        var imgDom = document.createElement("img");
        divDom.classList.add("info");
        divDom.classList.add("legend");
        divDom.append(imgDom);
        imgDom.src = img;
        return divDom;
    };

    legend.addTo(map);
}

function initDraw(mapName) {
    initDraw = function () {};
    var drawnItems = new L.FeatureGroup();
    let map = window[mapName];
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            polyline: false,
            // rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
        }
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, function (event) {
        let showFlag = {
            flag: false,
            all: false
        };
        let layer = event.layer;
        console.log(layer.toGeoJSON().geometry.coordinates)
        drawnItems.addLayer(layer);
        let json = JSON.stringify({
            "type":"Feature",
            "properties":{},
            "geometry":{
                "type":"MultiPolygon",
                "coordinates": [layer.toGeoJSON().geometry.coordinates]
            }
        })
        map.on(L.Draw.Event.EDITSTART,function(event1){
            if(showFlag.flag){
                close();
            }
            showFlag.all = true;
        })
        map.on(L.Draw.Event.EDITED,function(event1){
            showFlag.all = false;
            json = JSON.stringify({
                "type":"Feature",
                "properties":{},
                "geometry":{
                    "type":"MultiPolygon",
                    "coordinates": [layer.toGeoJSON().geometry.coordinates]
                }
            })
        })

        layer.on({
            click: function (e) {
                window.$emit({geoJson:layer.toGeoJSON()},'drawer','click')
            }
        });
        // document.getElementsByClassName("leaflet-draw-edit-remove")[0].onclick =()=>{
        //     showFlag.all = true;
        //         close();
        // }
        // todo 一下方法可以添加触发方法
        map.on(L.Draw.Event.DELETESTART, function(event){
            showFlag.all = true;
            if(showFlag.flag){
                close();
            }
        })
        map.on(L.Draw.Event.DELETESTOP, function(event){
            showFlag.all = false;
        })
        map.on(L.Draw.Event.EDITSTOP, function(event){
            showFlag.all = false;
        })
        map.on(L.Draw.Event.DELETED, function(event){
            if(showFlag.flag){
                close();
                showFlag.all = false;
            }
        })
    });
}