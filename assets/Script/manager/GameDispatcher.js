
/*

GameDispatcher 游戏调度器 单例

 */

var GameDispatcher = cc.Class({
	properties: {
        _className: "GameDispatcher"
    },

    ctor: function () {
    	var self = this;
    },

    init: function () {
        var self = this;

        window.mm = new ModuleManager(); //模块
        window.pm = new PopupManager(); //弹窗
        window.rm = new ResourceManager(); //资源
        window.mp = new MusicPlayer();
        window.leve_rm = new LevelResourceManager();//关卡资源管理

        self.initCache();

        window.mm.init();

        self.curScene = null; //当前场景
        self.curSceneName = ""; //当前场景名称
    },
    
    clean: function (args) {
        var self = this;

        window.mm.clean();
        window.pm.clean();
    },

    //初始化缓存
    initCache: function() {
        var self = this;

        // self.genUin();
    },

    genUin: function() {
        var self = this;
        
        var code = cc.sys.localStorage.getItem(qf.sk.UIN) || "";
        if (!code || code.length < 8) {
            qf.platform.getRegInfo(function(ret){
                if (ret === 0) {
                    var login_data = qf.platform.getLocLoginData();
                    cc.sys.localStorage.setItem(qf.sk.UIN, login_data.code);
                }
                else {
                    setTimeOut(function(){
                        self.genUin();
                    }, 100);
                }
            });
        }
    },

    launch: function (args) {
        var self = this;
        self.initGameConfig();  //初始化游戏设置
        self.runScene();

        //每隔30s垃圾回收一次
        cc.director.getScheduler().schedule(function() {
            qf.platform.garbageCollect();
        }, SceneLayer, 30);

        //不需要授权
        // qf.platform.authorize();

        //如果是微信小游戏直接到登录界面
        //否则到loadding场景进行拉取资源的操作

        // if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        //     //微信小游戏
        //     self.runLoginScene();
        // }
        // else {
        //     self.runLoaddingScene();
        // }
    },
    
    initGameConfig: function () {
        var self = this;

        //设置设备平台
        var platform_name = qf.platform.getPlatformName();
        if (platform_name){
            qf.config.OS = "web_" + platform_name
        }else {
            qf.config.OS = "web_other";
        }

        //获取启动参数
        // var launch_data = qf.platform.getLaunchData();
        // qf.platform.uploadEventStat({   //用户点击进入
        //     "module": "reg_funnel",
        //     "event": STAT_KEY.EVENT_REG_FUNNEL_CLICK_INTO_GAME,
        //     "custom":{
        //         "launch": JSON.stringify(launch_data)
        //     }
        // });
    },

    runScene: function() {
        var self = this;

        self.curScene = new cc.Scene();
        self.curSceneName = "loadding";

        self.setlayer();

        qf.pm.init();
        
        cc.director.runScene(self.curScene);

        qf.mm.get("global").show();

        qf.mm.get("loadding").show();
    },

    //切换场景
    switchScene: function (args) {
        var self = this;

        if (!args) return null;

        var scene = args.scene;
        if (!scene) return null;

        //在切换场景前先清理各个模块
        self.clean();

        if (scene === "loadding") {
            self.runLoaddingScene(args);
        }
        else if (scene === "login") {
            //需要切换到登录
            self.runLoginScene(args);
        }
        else if (scene === "main") {
            //主界面
            self.runMainScene(args);
        }
        else if (scene === "game") {
            //游戏界面
            self.runGameScene(args);
        }
        else
            return null;
    },

    runLoginScene: function (args) {
        var self = this;

        self.curScene = new cc.Scene();
        self.curSceneName = "login";

        self.setlayer();
        qf.pm.init();
        cc.director.runScene(self.curScene);

        qf.mm.get("login").show();
    },

    runLoaddingScene: function (args) {
        var self = this;

        self.curScene = new cc.Scene();
        self.curSceneName = "loadding";

        self.setlayer();
        qf.pm.init();
        cc.director.runScene(self.curScene);

        qf.mm.get("loadding").show();
    },

    runMainScene: function (args) {
        var self = this;

        self.curScene = new cc.Scene();
        self.curSceneName = "main";

        self.setlayer();
        qf.pm.init();
        cc.director.runScene(self.curScene);
    },

    runGameScene: function (args) {
        var self = this;

        self.curScene = new cc.Scene();
        self.curSceneName = "game";

        self.setlayer();
        qf.pm.init();
        cc.director.runScene(self.curScene);

        
    },
    
    setlayer: function (args) {
        var self = this;

        // 每个场景均有4个layer
        SceneLayer = new cc.Layer(); //每个场景的主层
        ViewLayer = new cc.Layer(); //视图层:全屏界面或者非弹窗界面
        DialogLayer = new cc.Layer(); //弹窗层:弹窗
        GlobalLayer = new cc.Layer(); //全局层（最上层）
        var SwallowLayer = self.getSwallowTouchesLayer();   //多点触摸吞噬层
        self.swallowLayer = SwallowLayer;

        self.curScene.addChild(SceneLayer, 0);
        self.curScene.addChild(ViewLayer, 10);
        self.curScene.addChild(DialogLayer, 20);
        self.curScene.addChild(GlobalLayer, 30);
        self.curScene.addChild(SwallowLayer, 100); //多点触摸吞噬layer
    },

    setSwallowLayerVisible: function (bool) {
        var self = this;

        if (!bool) {
            cc.eventManager.removeListeners(self.swallowLayer);
        } else {
            cc.eventManager.addListener(self.swallowTouchListener, self.swallowLayer);
        }
    },

    getSwallowTouchesLayer: function() {
        var self = this;
        var curTouch = null;
        var layer = new cc.Layer();
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event) {
                if(!curTouch){
                    listener.setSwallowTouches(false);
                    curTouch = touch;
                }else
                    listener.setSwallowTouches(true);
                return true;
            },
            onTouchEnded:function(touch, event) {
                if(touch === curTouch){
                    listener.setSwallowTouches(false);
                    curTouch = null;
                }
            },
            onTouchCancelled:function (touch, event) {
                if(touch === curTouch){
                    listener.setSwallowTouches(false);
                    curTouch = null;
                }
            }
        });
        self.swallowTouchListener = listener;
        cc.eventManager.addListener(listener, layer);
        return layer;
    }
});

module.exports = GameDispatcher;
