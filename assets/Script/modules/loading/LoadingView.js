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
        Label_load: cc.Label,
        ProgressBar_load: cc.ProgressBar,
        Sprite_circle: cc.Sprite
    },
    ctor: function () {
        var self = this;
    },

    //初始化数据
    initData: function (args) {

    },

    //初始化Ui
    initUi: function () {
        this.ProgressBar_load.progress = 0;
        this.Label_load.string = cc.js.formatStr(i18n.t('GameTxt.loading'), 0);
        this.setProgressActive(false);
        //开始下载
        this.startLoadding();
    },

    //event.target为当前点击对象
    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        switch(customEventData){
            
        }
    },

    setProgressActive: function(active) {
        this.Label_load.node.active = active;
        this.ProgressBar_load.node.active = active;
    },

    startLoadding: function() {
        var self = this;
        var preLoadModule = ["global", "main", "preloadAudio"];
        //重连时到登陆界面，判断当前资源是否加载过
        if (gm.rm.isLoadded(preLoadModule)){
            self.enterGameHall();
            return;
        }

        self.setProgressActive(true);
        var curModuleIndex = 0;
        var modulePercent = 100/preLoadModule.length;
        var blockCallback = function(count, total) {
            var percent = count/total*modulePercent+modulePercent*curModuleIndex;
            percent = Math.min(percent, 100);
            percent = Math.floor(percent);
            self.ProgressBar_load.progress = percent/100;
            self.Sprite_circle.node.x = ((percent/100 - 0.5)*self.ProgressBar_load.node.getContentSize().width);
            self.Label_load.string = cc.js.formatStr(i18n.t('GameTxt.loading'), percent);
        };
        gm.rm.load(preLoadModule, function(completedCount, totalCount, item) {
            blockCallback(completedCount, totalCount);
            if(completedCount === totalCount){curModuleIndex = curModuleIndex + 1;}
        }, function() {
            setTimeout(function(){
                self.enterGameHall();
            }, 500);
        });
    },
    
    enterGameHall: function () {
        //关闭Loading界面
        gm.event.dispatchEvent(ET.EVT_CLOSE_SCENCE_LOADING);
        //加载global界面
        gm.event.dispatchEvent(ET.EVT_OPEN_SCENCE_GLOBAL);
        //加载主界面
        gm.event.dispatchEvent(ET.EVT_OPEN_SCENCE_MAIN);
    }
});

module.exports = LoadingView;