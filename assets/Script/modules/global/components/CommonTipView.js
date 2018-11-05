/*
    公共提示弹窗
*/
var BasicView = require("BasicView");
var CommonTipView = cc.Class({
    extends: BasicView,
    properties: {
        _className: {
            default: "CommonTipView",
            override: true
        }
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
        switch(customEventData){
            case "close": //关闭界面
                this.closeView();
                break;
            case "cancel": //取消
                break;
            case "sure":   //确认
                break;
        }
    }
});

module.exports = CommonTipView;