/*
BasicView 所有弹窗基类
*/
var BasicView = cc.Class({
	extends: cc.Component,
	properties: {
        _className: "BasicView",
        _popViewId: -1,
		_data: null
    },

	ctor: function(){

	},

    //Override
    onLoad: function(){
        this.node.setContentSize(cc.winSize);
    },

	//初始化界面
	initView: function(args){
		this.initData(args);
		this.initUi(args);
	},

	//初始化数据
	initData: function(args) {
		this._showActionType = args.showActionType?args.showActionType:0;  //显示动画  0:缩放动画 1:无动画
		this._alwaysShow = args.alwaysShow?args.alwaysShow:false;	//是否一致显示
		this._showCb = args.cb;	//显示回调, 弹窗动画播放完毕执行
	},

	//初始化UI
	initUi: function(args) {
		
	},

	reqData: function() {},

	setData: function(data) {
		this._data = data;
	},

	show: function() {
		this.enterAction();
	},

	closeView: function() {
		this.exitAction();
	},

	hide: function() {
		this.setActive(false);
	},

	getName: function() {
		return this._className;
	},

	setPopViewId: function(popViewId) {
		this._popViewId = popViewId;
	},

	getPopViewId: function() {
		return this._popViewId;
	},

	//Override
	onLoad: function () {
        
    },

    //Override
    start: function () {
    
    },

    //Override
    update: function (dt) {

    },

    //Override
    lateUpdate: function (dt) {
        
    },

    //Override
    onEnable: function () {

    },

    //Override
    onDisable: function () {
        // body...
    },

    //Override
    onDestroy: function () {
        
    },

    setActive: function(active) {
        this.node.active = active;
    },

    isActive: function(){
        return this.node.active
    },

    setFromName: function(fromName) {
        this._fromName = fromName;
    },

    getFromName: function() {
        return this._fromName;
    },

    //是否一直显示
    isAlwaysShow: function() {
    	return this._alwaysShow;
    },

    //弹窗管理器移除弹窗
    remove: function() {
        gm.pm.removeView(this._popViewId);
    },

    //删除节点
    destroyNode: function() {
    	this.node.destroy();
    },

    //打开弹窗动画
    enterAction: function() {
    	var self = this;
		this.setActive(true);
		//弹窗结束执行
		var enterFunc = function() {
			if (self._showCb) {
				self._showCb();
				self._showCb = null;
			}
		};

		//背景
		if(!this.bgColorLayer){
			this.bgColorLayer = new cc.Node();
    		var spr = this.bgColorLayer.addComponent(cc.Sprite);
            spr.type = cc.Sprite.Type.SLICED;
            spr.spriteFrame = cc.loader.getRes(GameRes.pngGlobalSprite9_2, cc.SpriteFrame);
			this.bgColorLayer.parent = this.node;
			this.bgColorLayer.zIndex = -1;
            this.bgColorLayer.setContentSize(cc.winSize);
		}
		this.bgColorLayer.color = new cc.Color(0, 0, 0);

		//无动画弹窗
		if(this._showActionType == 1){
			this.bgColorLayer.opacity = 150;
			enterFunc()
		}else{
		//动画弹窗
			var time = 0.2;
			this.node.setScale(0.6);
			this.node.runAction(cc.sequence(
				cc.show(),
                cc.scaleTo(time, 1.1).easing(cc.easeSineOut()),
                cc.scaleTo(time, 1.0).easing(cc.easeSineOut()),
				cc.delayTime(0.01),
				cc.callFunc(function(sender){
					enterFunc()
				})
			));

			this.bgColorLayer.opacity = 0;
			this.bgColorLayer.runAction(cc.sequence(
				cc.delayTime(time),
				cc.fadeTo(0.2,150)
			));
		}
	},

	//关闭弹窗动画
	exitAction: function() {
		var self = this;
		//背景
		if(this.bgColorLayer){
            this.bgColorLayer.destroy();
            this.bgColorLayer = null
        }

        //无动画退出
		if (this._showActionType === 1)
			this.remove();
		else{
		//有动画退出
			var time = 0.1;
			this.node.runAction(cc.sequence(
				cc.spawn(
					cc.scaleTo(time, 0.8),
					cc.fadeTo(time, 130)
				),
				cc.callFunc(function(sender) {
                    self.remove();
				})
			));
		}
	}
});

module.exports = BasicView;