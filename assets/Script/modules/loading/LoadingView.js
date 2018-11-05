/*=======================================
	主界面大厅View
	2018/1/29
	Zero
=======================================*/
var View = require("View");
var LoadingView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "LoadingView",
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

    //event.target为当前点击对象
    clickEvent: function(event, customEventData) {
        switch(customEventData){
            
        }
    }
});

module.exports = LoadingView;