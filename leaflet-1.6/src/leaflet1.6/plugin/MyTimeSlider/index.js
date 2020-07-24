/**
 * 时间滑块插件
 * 参数说明
 * url: 'http://10.10.1.132:8080/geoserver/draught/wms' geoserver 对应的链接
 * wmsOption: wms 的 参数 { service,request,layers,styles,format,transparent,version,srs }
 * formParamFunction: 这个是 生成 wms 参数中的 layers 和 styles 参数的方法，因为对应不同的 time 的 layer 应该是有所变化的，这个变化不体现在 time 参数中
 * layerChange: 这是一个回调方法，发生在渲染新图层时，回调的参数为 {params,time,from}
 *      params: 就是 wms 参数
 *      time: 是 timeList 中现在在使用的那个
 *      from: 是 timeList 中现在在使用的那个的索引
 * timeList: 这个是时间列表，用于展示给用户看
 * from: 默认是 0，即第一个
 * timeout: 默认是 2000，即 播放 时，每到 2000 就播放下一张，但前提是上一张已经完成渲染
 *      如果上一张需要花 3 秒才能渲染完成，则这里 timeout 会失效一次，变成 4000 后播放下一张，然后还是每 2000 播放下一张
 * */
/*
L.control.MyTimeSlider({
    url: 'http://10.10.1.132:8080/geoserver/draught/wms',
    wmsOption: {
        // "layers": "draught:vswi_2019_11",(这个会变化)
        "styles": "draught:vswi",
        "service": "WMS",
        "request": "GetMap",
        "format": "image/png",
        "transparent": "true",
        "VERSION": "1.1.1",
        "srs": "EPSG",
    },
    formParamFunction: (time) => {
        // 将 2018-1 转成 2018_1
        let t = time.split('-');
        return {
            "layers": `draught:vswi_${t[0]}_${t[1]}`,
        }
    },
    layerChange({params,time,from}) {
        console.log(params,time,from);
    },
    timeList: ['2018-1','2018-3','2018-5','2018-7','2018-9','2018-11','2018-13','2018-15',],
    // from: 0,
    // timeout: 2000
}).addTo(map);
*/

(function () {
    // tar => a\div\h
    const addElement = function(tar,id,className,parent,prop,prevent) {
        // 创建一个关闭控件的按钮
        var ele = document.createElement(tar);
        if (id) ele.id = id;
        ele.className = className;

        if (parent) parent.appendChild(ele);
        if (prop) {
            for (let i in prop) {
                ele.setAttribute(i,prop[i]);
            }
        }
        if (prevent) {
            L.DomEvent
                .addListener(ele, 'click', L.DomEvent.stopPropagation)
                .addListener(ele, 'click', L.DomEvent.preventDefault);
        }
        // 注册关闭事件
        //L.DomEvent.addListener(this._closebutton, 'click', this._onCloseControl, this);
        return ele;
    };

    L.Control.MyTimeSlider = L.Control.extend({
        map: null,
        url: "",
        wmsOption: {
            // "service": "WMS",
            // "request": "GetMap",
            // // "layers": "draught:vswi_2019_11", 这个 layer 应该是要后期输入的
            // "styles": "draught:vswi",
            // "format": "image/png",
            // "transparent": "true",
            // "VERSION": "1.1.1",
            // "srs": "EPSG",
        },
        formParamFunction(time) {
            return {
                "layers": "draught:vswi_" + time,
                style: "",
            };
        },
        // 这个 time 是 提供为显示用的，
        // 然后这个 time 会提供给 formParamFunction，
        // 如果两者表现形式不同则需要编写特殊的转换方法
        timeList: [/*time1,time2*/],
        // 这个需要对应于 timeList，
        // 这里 from 是 0 ~ timeList.length - 1
        from: 0,
        // 每个 layer 显示的时长（如果渲染时长更长则会影响该时间）
        timeout: 2000,
        // 加载时设置为 false，阻止二次加载和多次调用
        loadOver: true,
        eles: {
            // 显示进度
            knob:null,
            playDom: null,
            pauseDom: null,
            stopDom: null,
            // setInterval id
            playId: null,
            // 显示时间的部分
            dateShow: null,
        },
        // 是否正在播放，默认是 false
        playing: false,
        // change
        layerChange() {},
        options: {
            position: 'bottomleft' //初始位置
        },
        initialize: function (options) {
            if (options.url) {
                this.url = options.url;
                delete options.url;
            } else { throw new Error("options.wmsOption = null") }
            if (options.layerChange) {
                this.layerChange = options.layerChange;
                delete options.layerChange;
            }
            if (options.wmsOption) {
                this.wmsOption = options.wmsOption;
                delete options.wmsOption;
            } else { throw new Error("options.wmsOption = null") }
            if (options.formParamFunction) {
                this.formParamFunction = options.formParamFunction;
                delete options.formParamFunction;
            } else { throw new Error("options.formParamFunction = null") }
            if (options.timeList) {
                this.timeList = options.timeList;
                delete options.timeList;
            } else { throw new Error("options.timeList = null") }
            if (options.from) {
                this.from = options.from;
                delete options.from;
            } else { this.from = 0; }
            if (options.timeout) {
                this.timeout = options.timeout;
                delete options.timeout;
            } else { this.timeout = 2000; }
            L.Util.extend(this.options, options);
        },
        onAdd: function (map) {
            let $this = this;
            this.map = map;
            //创建一个class为leaflet-control-clegend的div
            this._container = L.DomUtil.create('div', 'leaflet-control-clegend');
            // 主体 div
            let div = addElement('div',"","leaflet-bar leaflet-bar-horizontal leaflet-bar-timecontrol leaflet-control",this._container,{},true);
            // 往前 按钮
            {
                let BackwardBtn = addElement('a',"","leaflet-control-timecontrol timecontrol-backward",div, {
                    href: '#',title: 'Backward'
                },true);
                L.DomEvent.addListener(BackwardBtn, 'click', function (e) {
                    e.stopPropagation();
                    $this.perLayer();
                }, this);
            }
            // 播放 按钮
            {
                this.eles.playDom = addElement('a',"","leaflet-control-timecontrol timecontrol-play play",div, {
                    href: '#',title: 'Play'
                },true);
                L.DomEvent.addListener(this.eles.playDom, 'click', function (e) {
                    e.stopPropagation();
                    $this.playLayer();
                }, this);
                this.eles.pauseDom = addElement('a',"","leaflet-control-timecontrol timecontrol-play pause",div, {
                    href: '#',title: 'Pause'
                },true);
                L.DomEvent.addListener(this.eles.pauseDom, 'click', function (e) {
                    e.stopPropagation();
                    $this.pauseLayer();
                }, this);
                this.eles.pauseDom.style.display = "none";
            }
            // 停止播放 按钮
            {
                this.eles.stopDom = addElement('a',"","leaflet-control-timecontrol timecontrol-stop stop",div, {
                    href: '#',title: 'Stop'
                },true);
                L.DomEvent.addListener(this.eles.stopDom, 'click', function (e) {
                    e.stopPropagation();
                    $this.stopLayer();
                }, this);
            }
            // 往后 按钮
            {
                let ForwardBtn = addElement('a',"","leaflet-control-timecontrol timecontrol-forward",div, {
                    href: '#',title: 'Forward'
                },true);
                L.DomEvent.addListener(ForwardBtn, 'click', function (e) {
                    e.stopPropagation();
                    $this.nextLayer();
                }, this);
            }
            // 进度条
            {
                this.eles.dateShow = addElement('a',"","leaflet-control-timecontrol timecontrol-date",div, {
                    href: '#',title: 'Date'
                },true);
                this.eles.dateShow.innerText = this.timeList[this.from];
                let slider = addElement('div',"","leaflet-control-timecontrol timecontrol-slider timecontrol-dateslider",div);
                let sliderDiv = addElement('div',"","slider",slider);
                this.eles.knob = addElement('div',"","knob main",sliderDiv);
            }
            this.run();
            return this._container;
        },
        nextLayer(force) {
            if ((this.loadOver && !this.playing) || force) {
                this.from++;
                if (this.from === this.timeList.length) this.from = 0;
                this.run(()=>{});
            }
        },
        perLayer() {
            if (this.loadOver && !this.playing) {
                this.from--;
                if (this.from < 0) this.from = this.timeList.length - 1;
                this.run(()=>{});
            }
        },
        playLayer() {
            let $this = this;
            if (!$this.playing) {
                $this.playing = true;
                this.eles.playDom.style.display = "none";
                this.eles.pauseDom.style.display = "block";
                $this.eles.playId = setInterval(function () {
                    if ($this.from === $this.timeList.length - 1) {
                        // $this.nextLayer(true);
                        $this.stopLayer();
                    } else {
                        $this.nextLayer(true);
                    }
                },$this.timeout);
            }
        },
        pauseLayer() {
            let $this = this;
            if ($this.playing) {
                $this.playing = false;
                this.eles.playDom.style.display = "block";
                this.eles.pauseDom.style.display = "none";
                clearInterval($this.eles.playId);
            }
        },
        stopLayer() {
            let $this = this;
            clearInterval($this.eles.playId);
            $this.playing = false;
            this.eles.playDom.style.display = "block";
            this.eles.pauseDom.style.display = "none";
            $this.from = 0;
            $this.run();
        },
        run(cb) {
            cb = cb || (()=>{});
            if (this.loadOver) {
                let $this = this;
                let params = {
                    ...this.wmsOption,
                    ...this.formParamFunction(this.timeList[this.from])
                };
                var lay = L.tileLayer.wms(this.url,params ,true);
                lay.addTo(this.map);
                this.loadOver = false;
                lay.on('load',function () {
                    $this.loadOver = true;
                    console.log("loaded")
                });
                this.eles.knob.style.transform = `translate3d(${200 * (this.from) / (this.timeList.length - 1)}px, 0px, 0px)`;
                this.eles.dateShow.innerText = this.timeList[this.from];
                this.layerChange({
                    params,
                    time: this.timeList[this.from],
                    from: this.from
                });
                cb(true);
            } else {
                cb(false);
                return false;
            }
        }
    });

    L.control.MyTimeSlider = function (options) {
        return new L.Control.MyTimeSlider(options)
    };
})();

// let formParamFunction = `(time) => {
//             // 将 2018-1 转成 2018_1
//             let t = time.split('-');
//             return {
//                 "layers": "draught:vswi_" + t[0] + "_" + t[1],
//             }
//         }`;
// timeList = ['2018-1','2018-3','2018-5','2018-7','2018-9','2018-11','2018-13','2018-15',]
function AddMyTimeSlider(map,url,wmsOption,formParamFunction,timeList,timeout,from) {
    if (window.myTimeSlider) {
        window.myTimeSlider.remove();
    }
    window.myTimeSlider = L.control.MyTimeSlider({
        url,
        wmsOption: (typeof wmsOption === "string") ? JSON.parse(wmsOption) : wmsOption,
        formParamFunction: (typeof formParamFunction === "string") ? eval(formParamFunction) : formParamFunction,
        layerChange({params,time,from}) {
            window.$emit({params,time,from},"timeSlider","layerChange");
        },
        timeList: (typeof timeList === "string") ? JSON.parse(timeList) : timeList,
        from: from || 0,
        timeout: timeout || 2000
    }).addTo(map);
}
