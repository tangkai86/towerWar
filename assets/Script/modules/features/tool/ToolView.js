/*=======================================
	主界面大厅View
	2018/1/29
	Zero
=======================================*/
var BasicView = require("BasicView");
var ToolView = cc.Class({
    extends: BasicView,
    properties: {
        _className: {
            default: "ToolView",
            override: true
        },
    },
    ctor: function () {
        var self = this;
    },

    //初始化数据
    initData: function (args) {
        this._super(args);
    },

    //初始化Ui
    initUi: function (args) {
        this._super(args);
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        var node = event.target;
        console.log(event);
        cc.log("按钮点击事件:"+customEventData);
        switch(customEventData){
            case "close": //关闭界面
                this.closeView();
                break;
            case "commonTip":  //公共提示
                gm.event.dispatchEvent(ET.EVT_OPEN_VIEW_COMMONTIP);
                break;
        }
    }
});

module.exports = ToolView;