let MarkerControlPanel = class {
    constructor(option,{MarkManager,GraphicManager},{marker,line,polygon},) {
        this.viewer = null;
        this.divId = "marker_manager_panel_" + (new Date().getTime());
        this.divDom = null;
        this.option = Object.assign({
            bottom: 0
        },(option || {}));
        this.bottom = {
            none: {
                top: "0px"
            },
            defaultOptions: {
                top: "46px"
            },
        };
        this.MarkManager = MarkManager;
        this.GraphicManager = GraphicManager;
        this.dom = {
            markerLi: null,
            lineLi: null,
            polygonLi: null,
            layerManagerLi: null,
            importLi: null,
            exportLi: null,
            // 当添加标记之后要显示一个填写的信息框
            addMarkerInfo: null,
            // 这个是信息框的 名字字段
            nameInput: null,
            // 这个是信息框的 描述字段
            descInput: null,
            // 这个是信息框 输入完成后点击的按钮
            okBtn: null,
            // 这个是信息框 取消按钮
            cancelBtn: null,
        };

        this.showTypes = {
            marker: marker || false,
            line: line || false,
            polygon: polygon || false
        }
    }
    // 更新哪些控件显示哪些不显示
    updateIconStatus({marker,line,polygon}) {
        this.showTypes = {
            marker: marker || this.showTypes.marker,
            line: line || this.showTypes.line,
            polygon: polygon || this.showTypes.polygon
        }
        for (let i in this.showTypes) {
            this.dom[i + "Li"].style.display = this.showTypes[i] ? "block" : "none";
        }
        return this;
    }

    init (viewer) {
        this.viewer = viewer;
        if (!this.divDom) {
            document.head.innerHTML += `<style>
                   #${this.divId} {
                        position: absolute;
                        display: none;
                        padding: 4px 4px 1px;
                        font: 14px/16px Arial, Helvetica, sans-serif;
                        border-radius: 5px;
                        right: 5px;
                    }
                    ul[${this.divId}] {
                        padding: 0;
                    }
                    ul[${this.divId}] li {
                        cursor: pointer;
                        float: left;
                        padding: 0 0 0;
                        width: 65px;
                        height: 100%;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        list-style: none;
                        color: #3A89DD;
                    }
                    ul[${this.divId}] li i {
                        display: block;
                        height: 16px;
                        width: 16px;
                        background-size: contain;
                        margin: 0 auto;
                        margin-top: 8px;
                    }
                    ul[${this.divId}] li span {
                        user-select: none;
                        display: block;
                        text-align: center;
                        line-height: 22px;
                    }
                    ul[${this.divId}] li:hover {
                            color: #d2eaff;
                    }
                    .graphic-draw-main[${this.divId}] {
                        height: 52px;
                        padding: 0 5px;
                        vertical-align: top;
                        color: #3A89DD;
                        border-radius: 4px;
                    }
                </style>`;
            this.divDom = (function() {
                let div = document.createElement('div');
                div.id = this.divId;
                div.innerHTML = `<main style="background: #171E26;" ${this.divId}="" class="el-main graphic-draw-main">
                        <ul ${this.divId}="">
                            <li tar="marker"><i title="添加标记" class="iconfont iconmarker icon-class"></i><span class="">标记</span></li>
                            <li tar="line"><i title="添加线段" class="iconfont iconpolyline icon-class"></i><span class="">折线</span></li>
                            <li tar="polygon"><i title="添加多边形" class="iconfont iconpolygon icon-class"></i><span class="">多边形</span></li>
                            <!--<li tar="layerManager"><i title="图层管理" class="iconfont iconlayer icon-class"></i><span class="">图层管理</span></li>-->
                            <!--<li tar="import"><i title="导入" class="iconfont iconimport action-icon-class"></i><span class="">导入</span></li>-->
                            <!--<li tar="export"><i title="导出" class="iconfont iconexport action-icon-class"></i><span class="">导出</span></li>-->
                        </ul>
                    </main>
                    <div tar="addMarkerInfo" style="position: fixed;left: 0;right: 0;bottom: 0;top: 0;background: rgba(23, 30, 38,0.5);display: none;">
                        <div style="color: #3A89DD;width: 250px;margin: auto;top: calc(50% - 50px);
                        position: fixed;left: calc(50% - 125px);background: #171E26;padding: 5px;border-radius: 5px;">
                            <div style="text-align: center;">添加标记</div>
                            <div style="padding-top: 5px;">
                                <div style="display: inline-block;width: 40px;">名称:</div>
                                <input style="width: 200px;" tar="nameInput"/>
                            </div>
                            <div style="padding-top: 5px;">
                            <div style="display: inline-block;width: 40px;">描述:</div>
                            <input style="width: 200px;" tar="descInput"/>
                            <div style="padding-top: 10px;text-align: center;">
                                <button style="display: inline-block;line-height: 1;white-space: nowrap;
                            cursor: pointer;background: #FFF;border: 1px solid #DCDFE6;color: #606266;
                            text-align: center;box-sizing: border-box;outline: 0;margin: 0;padding: 4px 9px;
                            font-size: 13px;border-radius: 4px;font-weight: bold;margin-right: 3px;" tar="okBtn">确定</button>
                                <button style="display: inline-block;line-height: 1;white-space: nowrap;
                            cursor: pointer;background: #FFF;border: 1px solid #DCDFE6;color: #606266;
                            text-align: center;box-sizing: border-box;outline: 0;margin: 0;padding: 4px 9px;
                            font-size: 13px;border-radius: 4px;font-weight: bold;margin-left: 3px;" tar="cancelBtn">取消</button>
                            </div>
                        </div>
                    </div>`;
                return div;
            }).bind(this)();
            viewer._container.parentNode.append(this.divDom);
        }
        this.updateOption({});
        {
            let lis = this.divDom.getElementsByTagName("li");
            for (var i = 0;i < lis.length;i++) {
                let tar = lis[i].getAttribute('tar');
                if ((tar + "Li") in this.dom) {
                    this.dom[tar + "Li"] = lis[i];
                }
            }
            let divs = this.divDom.getElementsByTagName("div");
            for (var i = 0;i < divs.length;i++) {
                if (divs[i].getAttribute("tar") === "addMarkerInfo") {
                    this.dom.addMarkerInfo = divs[i];
                    break;
                }
            }
            let inputs = this.divDom.getElementsByTagName("input");
            for (var i = 0;i < inputs.length;i++) {
                if (inputs[i].getAttribute("tar") === "nameInput") {
                    this.dom.nameInput = inputs[i];
                } else if (inputs[i].getAttribute("tar") === "descInput") {
                    this.dom.descInput = inputs[i];
                }
            }
            let btns = this.divDom.getElementsByTagName("button");
            for (var i = 0;i < btns.length;i++) {
                if (btns[i].getAttribute("tar") === "okBtn") {
                    this.dom.okBtn = btns[i];
                } else if (btns[i].getAttribute("tar") === "cancelBtn") {
                    this.dom.cancelBtn = btns[i];
                }
            }
            this._bindEvent();
        }

        return this;
    }
    _bindEvent() {
        let $this = this;
        this.dom.markerLi.onclick = function () {
            $this.MarkManager.pick({},function ({id,marker}) {
                $this.dom.addMarkerInfo.style.display = "block";
            });
        }
        this.dom.polygonLi.onclick = function () {
            $this.GraphicManager.createPolygon();
        }
        this.dom.lineLi.onclick = function () {
            $this.GraphicManager.createPolyline();
        }
        if (this.dom.exportLi) {
            this.dom.exportLi.onclick = function () {
                let exp = {
                    marker: $this.MarkManager.export("MARKER",true,false),
                    polygon: $this.GraphicManager.export("POLYGON",false),
                    polyline: $this.GraphicManager.export("POLYLINE",false),
                }
                const blob = new Blob([JSON.stringify(exp)], { type: "" });
                saveAs(blob, parseInt(Cesium.getTimestamp()) + '.json');
            }
        }
        if (this.dom.importLi) {
            this.dom.importLi.onclick = function () {
                let inp = document.createElement("input");
                inp.type = "file";
                inp.style.display = "none";
                inp.onchange = function (evt) {
                    const files = evt.target.files,
                        ext = files[0].name.split(".")[1];
                    if (files.length > 0) {
                        const reader = new FileReader();
                        if (ext.toLowerCase() === "json") {
                            reader.readAsText(files[0]);
                            reader.onload = function() {
                                // _this[_this.upload2].import(JSON.parse(this.result));
                                if (!this.result) {
                                    return;
                                }
                                try {
                                    const jsonFileContent = JSON.parse(this.result);
                                    if ("marker" in jsonFileContent && jsonFileContent["marker"].features.length) {
                                        jsonFileContent["marker"].features.forEach(f => {
                                            $this.MarkManager.import(f);
                                        });
                                    }
                                    if ("polygon" in jsonFileContent && jsonFileContent["polygon"].features.length) {
                                        jsonFileContent["polygon"].features.forEach(f => {
                                            $this.GraphicManager.import(f);
                                        });
                                    }
                                    if ("polyline" in jsonFileContent && jsonFileContent["polyline"].features.length) {
                                        jsonFileContent["polyline"].features.forEach(f => {
                                            $this.GraphicManager.import(f);
                                        });
                                    }

                                } catch (e) {
                                    console.log(e);
                                }
                                // document.getElementById("graphicuploadhandler").value = "";
                            };
                        }
                    }
                    inp.remove();
                }
                document.body.appendChild(inp);
                inp.click();
            }
        }
        this.dom.cancelBtn.onclick = function () {
            $this.MarkManager.cancelMark();
        }
        this.dom.cancelBtn.onclick = function () {
            $this.MarkManager.cancelMark();
            $this.dom.addMarkerInfo.style.display = "none";
        }
        this.dom.okBtn.onclick = function () {
            $this.MarkManager.update($this.dom.nameInput.value,$this.dom.descInput.value);
            $this.dom.addMarkerInfo.style.display = "none";
        }
    }

    show() {
        if (!this.divDom) {
            this.init();
        }
        this.divDom.style.display = "block";
        return this;
    }

    updateOption(option) {
        this.option = Object.assign(this.option,(option || {}));
        this.divDom.style.top = this.option.top ? this.option.top : "0";
        return this;
    }
};