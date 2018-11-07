/*=======================================
	主界面大厅View
	2018/1/29
	Zero
=======================================*/
var View = require("View");
var MainView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "MainView",
            override: true
        },
    },
    ctor: function () {

    },

    //初始化数据
    initData: function () {

    },

    //初始化Ui
    initUi: function () {
        gm.mp.backgroundSineIn(GameRes.audioBgGame, true);
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        var node = event.target;
        console.log(event);
        cc.log("按钮点击事件:"+customEventData);
        switch(customEventData){
            case "activity": //打开活动
                gm.event.dispatchEvent(ET.EVT_OPEN_VIEW_ACTIVITY);
                break;
            case "shop":    //打开商城
                gm.event.dispatchEvent(ET.EVT_OPEN_VIEW_SHOP);
                break;
            case "rule":    //打开规则
                this.setActive(false);
                break;
        }
    }
});

module.exports = MainView;