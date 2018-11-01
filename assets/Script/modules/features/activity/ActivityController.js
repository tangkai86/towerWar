/*================================
	主界面controller控制类
	2018/1/29
	Zero
================================*/
var Controller = require("Controller");
var ActivityController = cc.Class({
    extends: Controller,
    properties: {
        _className: {
            default: "ActivityController",
            override: true
        },
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        var self = this;
        gm.event.addEvent(ET.EVT_OPEN_VIEW_ACTIVITY, this.openView.bind(this))
    },

    openView: function(args) {
        var self = this;
        if (!gm.rm.isLoadded("activity")) {
            gm.rm.load("activity", null, function() {
                self.openView(args);
            });
            return;
        }

        var activityView = gm.pm.getPopupWindow(self.activityHandler);
        if(activityView){
            return;
        }
        args = args ? args : {};
        var prefab = cc.loader.getRes(GameRes.prefabActivityView, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = DialogLayer;
        args.showActionType = 0;
        var activityView = viewNode.getComponent("ActivityView");
        activityView.initView(args);
        var handler = gm.pm.push(activityView);
        self.activityHandler = handler;
        gm.pm.pop();
    }
});

module.exports = ActivityController;