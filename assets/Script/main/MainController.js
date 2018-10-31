/*================================
	主界面controller控制类
	2018/1/29
	Zero
================================*/
var Controller = require("Controller");
var MainController = cc.Class({
    extends: Controller,
    properties: {
        _className: {
            default: "MainController",
            override: true
        },
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        var self = this;
        gm.event.addEvent(ET.EVT_OPEN_SCENCE_MAIN, this.openView.bind(this))
    },

    //注册模块监听事件
    initModuleEvent: function () {
        this.addModuleEvent(ET.EVT_OPEN_VIEW_ACTIVITY, this.openActivity.bind(this))
    },

    initView: function() {
        // 加载 Prefab
        cc.log("加载主界面");
        var prefab = cc.loader.getRes(GameRes.prefabMainView, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = gm.canvas;
        viewNode.active = true;
        return viewNode.getComponent("MainView");

        // var prefab = cc.loader.getRes(GameRes.prefabMainView);
        // console.log(prefab);
        // var viewNode = cc.instantiate(prefab);
        // viewNode.parent = gm.canvas;
        // return viewNode.getComponent("MainView");
    },

    openView: function(args) {
        cc.log("打开主界面");
        console.log(args);
        this.show({name:"main"});
    },

    openActivity: function() {
        cc.log("打开活动界面");
    }
});

module.exports = MainController;