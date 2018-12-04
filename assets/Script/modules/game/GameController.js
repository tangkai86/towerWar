
/*================================
    游戏界面controller控制类
    2018/11/12
    Zero
================================*/
var Controller = require("Controller");
var GameController = cc.Class({
    extends: Controller,
    properties: {
        _className: {
            default: "GameController",
            override: true
        },
    },

    ctor: function() {
        var self = this;
    },

    //注册全局监听事件
    initGlobalEvent: function () {
        gm.event.addEvent(ET.EVT_OPEN_SCENCE_GAME, this.openView.bind(this))
    },

    //注册模块监听事件
    initModuleEvent: function () {
        //顾客进入楼层
        this.addModuleEvent(ET.EVT_GUEST_ENTER_FLOOR, this.guestEnterFloor.bind(this))
    },

    initView: function() {
        // 加载 Prefab
        cc.log("加载游戏界面");
        var prefab = cc.loader.getRes(GameRes.prefabGameScence, cc.Prefab);
        var viewNode = cc.instantiate(prefab);
        viewNode.parent = SceneLayer;
        return viewNode.getComponent("GameView");
    },

    //顾客进入楼层
    guestEnterFloor: function(args){
        this.view.guestEnterFloor(args);
    },

    openView: function(args) {
        cc.log("打开主界面");
        console.log(args);
        this.show({name:"game", fromName: args.fromName});
    },
});

module.exports = GameController;
