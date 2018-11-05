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
        
    },

    //注册模块监听事件
    initModuleEvent: function () {
        
    },

    initView: function() {
        // 加载 Prefab
        cc.log("加载loading界面");
        var prefab = cc.loader.getRes(GameRes.prefabMainScence, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = SceneLayer;
        viewNode.active = true;
        return viewNode.getComponent("LoadingView");
    },

    openView: function(args) {
        cc.log("打开主界面");
        console.log(args);
        this.show({name:"main", fromName: args.fromName});
    }
});

module.exports = LoadingController;