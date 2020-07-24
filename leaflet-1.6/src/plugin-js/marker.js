const marker = function () {
    let myMap = "";
    let evalFn = () => {};
    let init = false;
    return {
        init(theIfrInstance,cb) {
            if (!init) {
                init = true;
                myMap = theIfrInstance.myMap();
                evalFn = theIfrInstance.eval.bind(theIfrInstance);
            }
            cb();
            return this;
        },
        addMarker({lat,lng}) {
            evalFn(`
                        let marker = L.marker([${lat}, ${lng}]).addTo(window.${myMap});
                    `)
        },
        addStationDivIcon({lat,lng,pngUrl,stationName,id,data},iconSize,iconAnchor) {
            iconSize = iconSize || [30, 30];
            let html = `<div style="height:40px;width:100px;text-align: center;" >
                                    <img style="height:${iconSize[1]}px;width:${iconSize[0]}px" src="${pngUrl}"/><br>
                                    <span style="background:white;font-weight:700;">${stationName}</span>
                                </div>`.replace(/\n/g,'').replace(/[ ]{2,}/,'');
            this.addDivIcon({lat,lng,id,data: data || {}},iconSize,iconAnchor,html);
        },
        addDivIcon({lat,lng,id,data},iconSize,iconAnchor,html) {
            evalFn(`var siteIcon = L.divIcon({
                        className: "leaflet-echart-icon",
                        html: '${html}',
                        iconSize: ${JSON.stringify(iconSize || [20, 30])}, // size of the icon
                        iconAnchor: ${JSON.stringify(iconAnchor || [50,20])}, // point of the icon which will correspond to marker's location
                        // popupAnchor: _.popupAnchor // point from which the popup should open relative to the iconAnchor
                    })
                    L.marker({lat:${lat},lng:${lng}}, {icon: siteIcon, draggable:false})
                        .addTo(window.${myMap}).on('click',function() {
                            window.$emit(${JSON.stringify(data)},'marker','click',{id:'${id}'});
                        });
                    `)
        }
    }
}