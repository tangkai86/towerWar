
/*=======================================
    游戏界面View
    2018/11/12
    Zero
=======================================*/
var View = require("View");
var GameView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "GameView",
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
        
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        
    },

    start () {

    }
});

module.exports = GameView;