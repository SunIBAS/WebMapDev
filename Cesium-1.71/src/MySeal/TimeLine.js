class TimeLine {
    // startTime = 2018-01-01
    // endTime = 2018-12-31
    // parameters = {}
    // year,month,day,dd 分别是 年月日、儒略日
    // parametersFromTime => ({year,month,day,dd}) => { return {} }
    // options = { alhpa: 透明度(0~1), speed: 3600 * 24 * 1000 <- 一天 }
    constructor(viewer, startTime, endTime, url, parameters, parametersFromTime, options) {
        this.dayReg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        this.viewer = viewer;
        this.startTime = '';
        this.endTime = '';
        startTime ? this.setDay(startTime, 'startTime') : false;
        endTime ? this.setDay(endTime, 'endTime') : false;
        this.startTimeMill = new Date(startTime).getTime();
        this.url = url || '';
        this.parameters = parameters || {};
        this.parametersFromTime = parametersFromTime || {};
        this.options = Object.assign({
            alpha: 0.5,
            speed: 3600 * 24 * 1000
        }, (options || {}));
        // this.destroyIndex = -1;
        viewer.clock.shouldAnimate = true;
        this.onTimelineChange = () => {};
        let $this = this;
        viewer.timeline.addEventListener('settime', function(e) {
            $this.onTimelineChange(e.timeJulian,CesiumUtils.julianIntToDate(e.timeJulian.dayNumber,$this.startTimeMill));
        }, false);
        //回调函数
        let id = setInterval(() => {
            $this.onTimelineChange(viewer.clock.currentTime,CesiumUtils.julianIntToDate(viewer.clock.currentTime.dayNumber,$this.startTimeMill));
        },200);
        // viewer.clock.onTick.addEventListener(function () {
        //     var currentTime = viewer.clock.currentTime.secondsOfDay;
        //     $this.onTimelineChange(currentTime,CesiumUtils.julianIntToDate(currentTime));
        // });
        this.providerId = null;
    }

    setTimeLineChangeEvent(fn) {
        this.onTimelineChange = fn;
        return this;
    }

    setDay(val, name) {
        if (this.dayReg.test(val)) {
            this[name] = val;
        } else {
            let d = val.toString().split('-');
            if (d[0].length != 4) {
                throw ("年份需要 4 位数");
            }
            if (d[1].length != 2) {
                d[1] = '0' + d[1];
            }
            if (d[2].length != 2) {
                d[2] = '0' + d[2];
            }
            val = d.join('-');
            if (this.dayReg.test(val)) {
                this[name] = val;
            } else {
                throw new Error("无法格式化当前给定时间，格式化结果为 ${val}")
            }
        }
    }

    // https://huangwang.github.io/2018/06/09/Cesium小部件animation和timeline的系统时间显示/
    UTC() {
        if (this.viewer.animation) {
            this.viewer.animation.viewModel.dateFormatter = localeDateTimeFormatter
            this.viewer.animation.viewModel.timeFormatter = localeTimeFormatter
        }
        this.viewer.timeline.makeLabel = function (time) {
            return localeDateTimeFormatter(time)
        }

        // Date formatting to a global form
        function localeDateTimeFormatter(datetime, viewModel, ignoredate) {
            var julianDT = new Cesium.JulianDate();
            Cesium.JulianDate.addHours(datetime, 8, julianDT)
            var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
            var objDT;
            if (ignoredate)
                objDT = '';
            else {
                objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day);
                objDT = gregorianDT.year + '年' + objDT.toLocaleString("zh-cn", {
                    month: "short"
                }) + gregorianDT.day + '日';
                if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
                    return objDT;
                objDT += ' ';
            }
            return objDT + Cesium.sprintf("%02d:%02d:%02d", gregorianDT.hour, gregorianDT.minute, gregorianDT.second);
        }

        function localeTimeFormatter(time, viewModel) {
            return localeDateTimeFormatter(time, viewModel, true);
        }
        return this;
    }

    set(startTime, endTime, url, parameters, parametersFromTime, options) {
        if (this.provider) {
            // console.warn("这里及其不稳定，请谨慎使用")
            let ind = 0;
            for (;ind < this.viewer.imageryLayers._layers.length;ind++) {
                if (this.viewer.imageryLayers._layers[ind].imageryProvider.id === this.providerId) {
                    break;
                }
            }
            if (ind < this.viewer.imageryLayers._layers.length) {
                this.viewer.imageryLayers.remove(this.viewer.imageryLayers._layers[ind]);
            }
            // console.warn("这里及其不稳定，请谨慎使用")
            this.viewer.imageryLayers.remove(this.provider);
        }
        this.setDay(startTime, 'startTime');
        this.setDay(endTime, 'endTime');
        this.startTimeMill = new Date(startTime).getTime();
        this.url = url;
        this.parameters = parameters;
        this.parametersFromTime = parametersFromTime;
        this.options = Object.assign(this.options, (options || {}));
        return this;
    }

    gid() {
        return "tl_" + (new Date().getTime()) + "_" + parseInt(Math.random() * 1000000);
    }

    // 修改完参数后必调的函数
    init() {
        let $this = this;
        this.times = Cesium.TimeIntervalCollection.fromIso8601({
            iso8601: `${this.startTime}/${this.endTime}/P1D`,
            leadingInterval: true,
            trailingInterval: true,
            isStopIncluded: false, // We want stop time to be part of the trailing interval
            dataCallback: this.dataCallback.bind(this)
        });
        this.provider = new Cesium.WebMapServiceImageryProvider({
            url: this.url,
            // layers: 'draught:vswi_{time}',
            parameters: this.parameters,
            clock: this.viewer.clock,
            times: this.times,
            // getFeatureInfoParameters: {
            //     query_layers: "vhi_2018_1",
            //     haha: "ibas",
            // }
        });

        this.imageryLayers = this.viewer.imageryLayers;
        this.layer = this.imageryLayers.addImageryProvider(this.provider);
        // this.destroyIndex = this.imageryLayers._layers.length - 1;
        this.provider.readyPromise.then(function () {
            var start = Cesium.JulianDate.fromIso8601($this.startTime);
            var stop = Cesium.JulianDate.fromIso8601($this.endTime);
            $this.viewer.clock.startTime = start;
            $this.viewer.clock.stopTime = stop;
            $this.viewer.clock.currentTime = start;
            $this.viewer.timeline.updateFromClock();

            $this.viewer.timeline.zoomTo(start, stop);

            var clock = $this.viewer.clock;
            clock.startTime = start;
            clock.stopTime = stop;
            clock.currentTime = start;
            clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            clock.multiplier = this.options.speed;
            $this.layer.alpha = this.options.alpha;
        });
        return this;
    }

    dataCallback(interval, index) {
        var time;
        if (index === 0) {
            // leading
            time = Cesium.JulianDate.toIso8601(interval.stop);
        } else {
            time = Cesium.JulianDate.toIso8601(interval.start);
        }

        time = new Date(time.split('T')[0]);
        // 获取儒略日
        let day = parseInt((time.getTime() - this.startTimeMill) / 3600 / 24 / 1000) + 1;
        return this.parametersFromTime({
            year: time.getYear() + 1900,
            month: time.getMonth() + 1,
            day: time.getDate(),
            dd: day
        });
        // return {
        //     layers: `vswi_${time.split('-')[0]}_${day}`,
        // };
    }
}