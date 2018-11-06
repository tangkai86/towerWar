/*================================
	主界面controller控制类
	2018/1/29
	Zero
================================*/
var Controller = require("Controller");
var LoadingController = cc.Class({
    extends: Controller,
    properties: {
        _className: {
            default: "LoadingController",
            override: true
        },
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        gm.event.addEvent(ET.EVT_OPEN_SCENCE_LOADING, this.openView.bind(this));
        gm.event.addEvent(ET.EVT_CLOSE_SCENCE_LOADING, this.remove.bind(this));
    },

    //注册模块监听事件
    initModuleEvent: function () {
        
    },

    initView: function() {
        var prefab = cc.loader.getRes(GameRes.prefabLoadingScence, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = SceneLayer;
        return viewNode.getComponent("LoadingView");
    },

    openView: function(args) {
        this.show({name:"loading", fromName: args.fromName});
    }
});

module.exports = LoadingController;