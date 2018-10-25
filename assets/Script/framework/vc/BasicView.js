/*
BasicView 所有弹窗基类
*/
var BasicView = cc.Class({
	extends: cc.Component,

	properties: {
        _className: "BasicView";
    },

	__ctor__: function(args) {
		this._super();
		args = args ? args : {};
		this.initData(args);
		this.initUI(args);
	},

	//初始化数据
	initData: function(args) {
		this._x = args.x;
		this._y = args.y;
		this._uid = args.uid;
		this._data = null;
		this._showActionType = args.showActionType?args.showActionType:0;
		this._dataLoadded = args.loaddedData?args.loaddedData:false;
		this._normalPosition = new cc.Vec2(0, 0);
		this._hasBackground = false;
		this._enterFinish = false;
		this._showCb = null;
		this._actionPop = null;
	},

	//初始化UI
	initUI: function(args) {
		this.setActive(false);
	},

	initClick: function() {},
	//自定义进入动画开始
	//cb:传入的动画完成时的回调
	onCustomEnterStart: function(cb) {
		var self = this;
		self._startAction = true;
		self.startEnterAction(function(){
			self._startAction = false;
			self.onCustomEnterFinish(cb);
		});
	},

	startEnterAction: function(cb) {
		var self = this;
		if (self._showActionType === 2)
			self._popScaleAction({x:self._x, y:self._y, cb:cb});
		else
			self._popAction({cb:cb});

		self.createBgLayerColor(true);
	},

	onCustomEnterFinish: function(cb) {
		var self = this;

		self._enterFinish = true;
		//进入完成时恢复大小、透明度
		self.setNormalStatus();

		if (self._dataLoadded)
			self.setView(self._data);

		if (cb) cb();
	},

	setNormalStatus: function() {
		this.node.setOpacity(0);
		this.node.setScale(1.0);
	},

	onCustomExitStart: function(cb) {
		var self = this;

		self._startAction = true;
		self.startExitAction(function(){
			self._startAction = false;
			self.onCustomExitFinish(cb);
		})
	},
	onCustomExitFinish: function(cb) {
		var self = this;

		if (cb) cb();
		var uid = self._uid;
        window.gm.pm.remove(uid);
	},

	startExitAction: function(cb) {
		if (this._showActionType === 1)
			this._backAction({cb:cb});
		else
			if (cb) cb();
	},

	setView: function(data) {
		if (!this._dataLoadded) return false;
		return true;
	},

	reqData: function() {},

	setData: function(data) {
		var self = this;

		self._data = data;
		self._dataLoadded = true;
		if (self._enterFinish)
			self.setView(data);
	},

	show: function(cb) {
		this._showCb = cb;
		//ignore: 背景检查
		self.onCustomEnterStart(cb);
	},

	//不带动画展示界面
	showWithoutAction: function(cb) {
		this._showCb = cb;
		//ignore: 背景检查
		this.createBgLayerColor();
		this.setActive(true);
		this.onCustomEnterFinish(cb);
	},

	display: function() {
		this.setNormalStatus();
		this.setPosition(self._normalPosition);
		this.setActive(true);
	},

	close: function(cb) {
		this.destroyBgColorLayer();
		this.onCustomExitStart(cb);
	},

	//不带动画的关闭此界面
	closeWithoutAction: function(cb) {
		this.onCustomExitFinish(cb);
	},

	hide: function() {
		this.destroyBgColorLayer();
		this.startExitAction(function() {
			this.setActive(false);
		});
	},

	hideWithoutAction: function() {
		this.setNormalStatus();
		if (this._actionPop) {
			this.stopAction(self._actionPop);
			this._actionPop = null;
			this._startAction = false;
			this.onCustomEnterFinish(self._showCb);
		}
		this.setVisible(false);
	},

	existBackground: function() {
		return this._hasBackground;
	},

	getName: function() {
		return this._className;
	},

	createBgLayerColor: function(isAction){
		var self = this;

		if (this.bgColorLayer){
			this.bgColorLayer.destroy();
		}

		self.bgColorLayer = new cc.LayerColor();
		self.addChild(self.bgColorLayer, -1);
		self.bgColorLayer.setColor(cc.color(0,0,0));

		if (isAction){
			self.bgColorLayer.setOpacity(0);
			self.bgColorLayer.runAction(new cc.Sequence(
				new cc.DelayTime(0.2),
				new cc.FadeTo(0.1,120)
			));
		}else {
			self.bgColorLayer.setOpacity(120);
		}
	},

	destroyBgColorLayer: function(){
		var self = this;

		if (self.bgColorLayer){
			self.bgColorLayer.removeFromParent();
			self.bgColorLayer = null;
		}
	},

	_popAction: function(args) {
		var self = this;

		args = args ? args : {};
		var time = args.time ? args.time : 0.2;
		var cb = args.cb;

		self._normal_position = cc.p(self.getPosition());

		self.setAnchorPoint(cc.p(0.5, 0.5));
		self.setScale(0.6);

		var action = self.runAction(new cc.Sequence(
			new cc.Show(),
			new cc.EaseSineOut(new cc.ScaleTo(time, 1.1)),
			new cc.EaseSineOut(new cc.ScaleTo(time, 1.0)),
			new cc.DelayTime(0.01),
			new cc.CallFunc(function(sender){
				self._action_pop = null;
				if (cb) cb(sender);
			})
		));
		self._action_pop = action;
	},

	_popScaleAction: function(args) {
		var self = this;

		args = args ? args : {};
		var x = args.x ? args.x : 0;
		var y = args.y ? args.y : 0;
		var cb = args.cb;
		var time = args.time === undefined ? 0.2 : args.time;

		self._normal_position = Display.center;

		self.setAnchorPoint(cc.p(0.5, 0.5));
		self.ignoreAnchorPointForPosition(false);
		self.setScale(0);
		self.setPosition(cc.p(x, y));

		var action = self.runAction(new cc.Sequence(
			new cc.Show(),
			new cc.EaseSineOut(new cc.Spawn(
                new cc.MoveTo(time, Display.center),
				new cc.ScaleTo(time, 1.0),
				new cc.FadeIn(time)
			)),
			new cc.EaseSineOut(new cc.ScaleTo(0.1, 1.05)),
			new cc.EaseSineOut(new cc.ScaleTo(0.05, 1.0)),
			new cc.DelayTime(0.01),
			new cc.CallFunc(function(sender){
				self._action_pop = null;
				if (cb) cb(sender);
			})
		));
		self._action_pop = action;
	},

	_backAction: function(args) {
		var self = this;

		args = args ? args : {};
		var cb = args.cb || null;
		var time = args.time === undefined ? 0.1 : args.time;
		var scale = 0.8;
		var opacity = 130;

		self.runAction(new cc.Sequence(
			new cc.Spawn(
				new cc.ScaleTo(time, scale),
				new cc.FadeTo(time, opacity)
			),
			new cc.CallFunc(function(sender) {
				self.setVisible(false);
				if (cb) cb(sender);
			})
		));
	},

	onEnter:function () {
        var self = this;
        self._super();
    },

	onExit:function () {
        var self = this;
        self._super();
    },

	cleanup:function () {
        var self = this;
        
        self._super();

        qf.platform.garbageCollect();
    }
});