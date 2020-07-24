<template>
    <div id="app">
        <div id="umap" ref="rootmap">
            <div id="map"></div>
        </div>
    </div>
</template>

<script>
    import L from 'leaflet';
    import './../leaflet-control-orderlayers-ibas/leaflet.control.orderlayers.ibas.js';
    import { buildLayerControl } from "./Common.js";
    HTMLElement.prototype.addChild = function (tagName,id,style,options) {
        let tag = document.createElement(tagName);
        tag.id = id;
        for (let i in style) {
            tag.style[i] = style[i];
        }
        if (options) {
            if ('innerText' in options) {
                tag.innerText = options.innerText;
            }
        }
        this.appendChild(tag);
        return this;
    };
    let map = {};

    export default {
        name: 'app',
        data() {
            return {
                id: 'map'
            }
        },
        methods: {
            renderMap() {
                this.$refs.rootmap.clearChild().addChild('div',this.id,{
                    width: '100%',
                    height: '100%'
                });
                map = L.map(this.id,{
                    zoom: 4,
                    center: {
                        lon: 70,
                        lat: 46.2
                    }
                });
                L.tileLayer.wms("http://11.11.11.164:8080/geoserver/draught/wms", {
                    zIndex: 30,
                    "format": "image/png",
                    "VERSION": "1.1.1",
                    "layers": "draught:vswi_2019_15",
                    "transparent": true,
                    styles: "draught:vswi"
                }).addTo(map);
                buildLayerControl(map,31,false);
            },
            getMap() {
                return map;
            }
        },
        mounted() {
            window.$tpl = this;
            this.renderMap();
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        width: 500px;
        height: 500px;
    }

    @import "./../node_modules/leaflet/dist/leaflet.css";
    @import "./../leaflet-control-orderlayers-ibas/leaflet.control.orderlayers.ibas.css";

    #umap {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    #map {
        width: 100%;
        height: 100%;
    }
</style>
