/*================================
	主界面controller控制类
	2018/1/29
	Zero
================================*/
var Controller = require("Controller");
var GlobalView = require("GlobalView");
var GlobalController = cc.Class({
    extends: Controller,
    properties: {
        _className: {
            default: "GlobalController",
            override: true
        },
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        gm.event.addEvent(ET.EVT_OPEN_SCENCE_GLOBAL, this.openView.bind(this));
        gm.event.addEvent(ET.EVT_OPEN_VIEW_COMMONTIP, this.openCommonTipView.bind(this));

        //全局toast提示
        gm.event.addEvent(ET.EVT_GLOBAL_TOAST, this.showToast.bind(this));
    },

    //注册模块监听事件
    initModuleEvent: function () {
        
    },

    initView: function() {
        var viewNode = new cc.Node();
        viewNode.addComponent(GlobalView);
        viewNode.parent = GlobalLayer;
        return viewNode.getComponent("GlobalView");
    },

    openView: function(args) {
        cc.log("打开global界面");
        this.show({name:"global"});
    },

    openCommonTipView: function (args) {
        var self = this;
        var commonTipView = gm.pm.getPopupWindow(self.commonTipHandler);
        if(commonTipView){
            return;
        }
        args = args ? args : {};
        var prefab = cc.loader.getRes(GameRes.prefabCommonTipView, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = DialogLayer;
        var commonTipView = viewNode.getComponent("CommonTipView");
        commonTipView.initView(args);
        var handler = gm.pm.push(commonTipView);
        self.commonTipHandler = handler;
        gm.pm.pop();
    },
    
    //全局吐司
    showToast: function (args) {
        
    }
});

module.exports = GlobalController;