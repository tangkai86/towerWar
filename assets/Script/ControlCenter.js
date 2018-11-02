// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ModuleManager = require("ModuleManager");
var PopupManager = require("PopupManager");
var ResourceManager = require("ResourceManager");
var EventManager = require("EventManager");
window.i18n = require('LanguageData');
window.ET = require("Event");
window.GameRes = require("GameRes");
cc.Class({
    extends: cc.Component,
    properties: {
        canvas:  cc.Node
    },
    ctor: function () {
        i18n.init('zh');
        var gm = gm ? gm : {};
        window.gm = gm;
        gm.event = {};
        new EventManager().extendMethods(gm.event); //事件管理
        gm.mm = new ModuleManager(); //模块
        gm.pm = new PopupManager(); //弹窗
        gm.rm = new ResourceManager(); //资源
        //gm.mp = new MusicPlayer();
    },

    onLoad () {
        cc.game.removePersistRootNode(this.node);
        window.SceneLayer = this.canvas.getChildByName("SceneLayer");
        window.DialogLayer = this.canvas.getChildByName("DialogLayer");
        window.GlobalLayer = this.canvas.getChildByName("GlobalLayer");
    },

    start () {
        //打开loading界面
        this.openLoadingView();
    },

    openLoadingView: function(args) {
        var self = this;
        if (!gm.rm.isLoadded("global")) {
            gm.rm.load("global", null, function () {
                self.openLoadingView(args);
            });
            return;
        }
        gm.event.dispatchEvent(ET.EVT_OPEN_SCENCE_MAIN, {fromName: "lanch"});
    }

    // update (dt) {},
});
