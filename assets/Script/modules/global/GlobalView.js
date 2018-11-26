/*=======================================
	主界面大厅View
	2018/1/29
	Zero
=======================================*/
var View = require("View");
var GlobalView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "GlobalView",
            override: true
        },
    },
    ctor: function () {
        var self = this;
    },

    //初始化数据
    initData: function () {
        var self = this;
    },

    //初始化Ui
    initUi: function () {
        var self = this;
    },

    onLoad: function () {
        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function(){
            console.log("游戏进入后台");
            self.appOnShow();
        },this);
        cc.game.on(cc.game.EVENT_SHOW, function(){
            console.log("重新返回游戏");
            self.appOnHide();
        },this);
    },

    //从后台返回
    appOnShow: function (args) {
        
    },

    //切换到后台
    appOnHide: function (args) {
        
    }
});

module.exports = GlobalView;