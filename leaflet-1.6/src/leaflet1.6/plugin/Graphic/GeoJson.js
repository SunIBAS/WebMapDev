// var geojson = {
//     "id": "2f0b4d17-4ab5-4435-8c82-4d88f618637f",
//     "geometry": {
//         "type": "MultiPolygon",
//         "coordinates": [
//             [
//                 [
//                     [ 136.0324249267578, 33.774089813232486 ],
//                     [ 136.0322265625, 33.77388763427728 ],
//                     [ 136.03250122070324, 33.77361297607428 ],
//                     [ 136.03250122070324, 33.77305603027349 ],
//                     [ 136.0324249267578, 33.774089813232486 ],
//                 ]
//             ]
//         ]
//     },
//     "properties": {
//         "createdAt": "2020-09-18T09:05:20.778Z",
//         "modifiedAt": "2020-09-18T09:05:20.778Z",
//         "name": "Some(Japan)_Some(Mie)_Some(KihÅ)",
//         "description": null
//     },
//     "type": "Feature"
// };
class GeoJson {
    static style = {
        color: "#2543ff",
        fillColor: "#6a5eff",
        fillOpacity: 0.2
    }
    static flashStyle = {
        color: "#ff9514",
        fillColor: "#ffcaaf",
        fillOpacity: 0.2
    }
    static flash = (target,flashStyle) => {
        let time = 10;
        let defaultStyle = {
            color: target.options.color,
            fillColor: target.options.fillColor,
            fillOpacity: target.options.fillOpacity
        };
        if (JSON.stringify(target.options) === '{}') {
            let lys = target.getLayers();
            if (lys.length) {
                defaultStyle = {
                    color: lys[0].options.color,
                    fillColor: lys[0].options.fillColor,
                    fillOpacity: lys[0].options.fillOpacity
                };
            }
        }
        let styles = [flashStyle || GeoJson.flashStyle,defaultStyle]
        let id = setInterval(function () {
            if (time) {
                target.setStyle(styles[time % 2]);
                time--;
            } else {
                clearInterval(id);
            }
        },200);
    }
    static fitBound(map,bounds) {
        map.fitBounds(bounds);
    }
    constructor(map,geojson,onClick,style,flashStyle) {
        onClick = onClick || (_ => _);
        this.map = map;
        this.flashStyle = flashStyle || GeoJson.flashStyle;
        style = style || GeoJson.style;
        this.id = geojson.id;
        if ('id' in geojson) { } else {
            this.id = `geojson_${new Date().getTime()}`;
        }
        this.geojson = geojson;
        this.geojsonObj = L.geoJSON(geojson, {
            ...style
        })
        setTimeout((function () {
            let $this = this;
            this.geojsonObj.on('click',function (a) {
                GeoJson.fitBound($this.map,a.propagatedFrom._bounds);
                // a.propagatedFrom.feature
                // a.propagatedFrom.feature._id
                GeoJson.flash(a.target,$this.flashStyle);
                window.a = a;
                console.log(a);
                onClick($this);
            });
        }).bind(this),200);
    }
    remove() {
        myMap.removeLayer(this.geojsonObj)
    }
}
class GeoJsonManager {
    constructor(map,onClick) {
        this.map = map;
        this.geojson = new Map();
        this.onClick = onClick;
    }

    // fitBounds = true ,false 是否缩放到对应位置，默认是 true
    addGeoJSON(geojson,fitBounds = true) {
        if (`type` in geojson && `coordinates` in geojson) {
            geojson = {
                geometry: geojson,
                properties: {},
                type: "Feature"
            }
        } else if ('id' in geojson) {
            let _geo = this.geojson.get(geojson.id);
            if (_geo) {
                this.zoomTo(geojson.id);
                return;
            }
        }
        let geo = new GeoJson(this.map,geojson,this.onClick);
        this.geojson.set(geo.id,geo);
        geo.geojsonObj.addTo(this.map);
        if (fitBounds) {
            this.zoomTo(geo.id);
        }
        console.log(geo.id);
        return this;
    }

    zoomTo(id) {
        let geo = this.geojson.get(id);
        if (geo) {
            this.map.fitBounds(geo.geojsonObj.getBounds());
        }
    }

    // shiftToDraw(id) {
    //     let geo = this.geojson.get(id);
    //     if (!geo) return {};
    //     this.map.removeLayer(geo.geojsonObj);
    //     window.addGeoJSONToGeoman(geo.geojson);
    //     this.remove(id);
    //     return {lys,ly};
    // }

    remove(id) {
        let geo = this.geojson.get(id);
        if (!geo) return {};
        this.geojson.delete(id);
        this.map.removeLayer(geo.geojsonObj);
    }
}