/*================================
	主界面controller控制类
	2018/1/29
	Zero
================================*/

var MainController = cc.Class({
    properties: {
        _className: "MainController",
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        var self = this;
    },

    //注册模块监听事件
    initModuleEvent: function () {
        var self = this;

    },

    initView: function() {
        var self = this;
        var view =  new MainView();
        SceneLayer.addChild(view);
        return view;
    },

    //销毁界面
    remove: function() {
        var self = this;
        self._super();
    }
});

module.exports = MainController;