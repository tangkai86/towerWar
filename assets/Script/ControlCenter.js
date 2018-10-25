// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var i18n = require('LanguageData');
var ModuleManager = require("ModuleManager");
var PopupManager = require("PopupManager");
var ResourceManager = require("ResourceManager");
var EventManager = require("EventManager");
cc.Class({
    extends: cc.Component,
    onLoad () {
        cc.game.removePersistRootNode(this.node);
        i18n.init('zh');
        var gm = {}
        gm.i18n = i18n; //多国语言管理
        gm.mm = new ModuleManager(); //模块
        gm.pm = new PopupManager(); //弹窗
        gm.rm = new ResourceManager(); //资源
        gm.event = {};
        new EventManager().extendMethods(gm.event); //事件管理
        //window.mp = new MusicPlayer();
        window.gm = gm;
    },

    start () {

    },

    // update (dt) {},
});
