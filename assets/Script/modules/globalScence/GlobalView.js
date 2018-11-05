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
    }
});

module.exports = GlobalView;