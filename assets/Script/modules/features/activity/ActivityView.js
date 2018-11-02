/*=======================================
	主界面大厅View
	2018/1/29
	Zero
=======================================*/
var BasicView = require("BasicView");
var ActivityView = cc.Class({
    extends: BasicView,
    properties: {
        _className: {
            default: "ActivityView",
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
        var node = event.target;
        console.log(event);
        cc.log("按钮点击事件:"+customEventData);
        switch(customEventData){
            case "close": //关闭界面
                this.closeView();
                break;
        }
    }
});

module.exports = ActivityView;