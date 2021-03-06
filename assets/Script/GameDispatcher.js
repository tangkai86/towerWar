// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Cache = require("Cache");
var ModuleManager = require("ModuleManager");
var PopupManager = require("PopupManager");
var ResourceManager = require("ResourceManager");
var EventManager = require("EventManager");
var MusicPlayer = require("MusicPlayer");
window.i18n = require('LanguageData');      //多国语言
window.SK = require("StorageKey");          //本地存档key
window.UtilAction = require("UtilAction"); //公共动作方法
window.ET = require("Event");                //游戏内的事件
window.GameRes = require("GameRes");        //游戏资源
window.gm = {};     //gm游戏管理器
cc.Class({
    extends: cc.Component,
    properties: {
        canvas:  cc.Node
    },
    ctor: function () {
        i18n.init('zh');
        window.Cache = new Cache();  //客户端数据缓存
        gm.event = {};
        new EventManager().extendMethods(gm.event); //事件管理
        gm.mm = new ModuleManager(); //模块
        gm.pm = new PopupManager(); //弹窗
        gm.rm = new ResourceManager(); //资源
        gm.mp = new MusicPlayer();   //音频

        //关闭调试
        //cc.director.setDisplayStats(false);
    },

    onLoad () {
        cc.game.removePersistRootNode(this.node);
        window.SceneLayer = this.canvas.getChildByName("SceneLayer");
        window.DialogLayer = this.canvas.getChildByName("DialogLayer");
        window.GlobalLayer = this.canvas.getChildByName("GlobalLayer");
    },

    start () {
        //打开loading界面
        gm.event.dispatchEvent(ET.EVT_OPEN_SCENCE_LOADING, {fromName: "lanch"});
        cc.log("打开Loading界面");
    }

    // update (dt) {},
});
