/*

PopupManager 弹窗管理器

*/

var PopupManager = cc.Class({
    properties: {
        _className: "PopupManager",
        ACTION_TAG: 8001,
        BACKGROUND: 8002,
    },

    ctor: function () {
        var self = this;
        self.STATUS = {NORMAL: "NORMAL", UPWARD: "UPWARD"};
    },

    init: function() {
    	var self = this;

    	self.root = DialogLayer;
    	self.root.setContentSize(cc.winSize);
    	self.root.setAnchorPoint(cc.p(0, 0));
    	self.root.setPosition(cc.p(0, 0));
    	self.root.setVisible(true);
    	self.zorder = self.root.getLocalZOrder();

    	self.queue = [];
    	self.queue_num = 0;
    	self.stack = [];
    	self.stack_num = 0;
    },

    getPopupLayer: function() {
    	var self = this;

    	return self.root;
    },

    getPopupWindow: function(id) {
    	var self = this;

    	for (var i=0; i < self.stack_num; i++) {
    		if (self.stack[i]._get("uid") === id)
    			return self.stack[i];
    	}
    },

    removeAllPopup: function() {
    	var self = this;

    	self.removeAllChilden();

    	self.root.setPosition(cc.p(0, 0));
    	self.root.setLocalZOrder(self.zorder);
    	self.root.setVisible(true);
        self.status = self.STATUS.NORMAL;
    },

	clean: function () {
		var self = this;

		self.removeAllPopup();
    },

    removeAllChilden: function(id) {
    	var self = this;

    	self.queue = [];
    	self.queue_num = 0;

    	for (var i = self.stack_num - 1; i >= 0; i--) {
    		if (!id || id !== self.stack[i]._get("uid")) {
    			self.stack[i].removeFromParent(true);

    			self.stack.splice(i, 1);
    			self.stack_num--;
    		}
    	}
    },

    setUpwardStatus: function(bool) {
        var self = this;

    	if (self.stack_num > 0) {
    		for (var i = 0; i < self.stack_num; i++) {
    			self.stack[i].setUpwardStatus(bool);
    		}
    	}
    },

    setUpwardEnabled: function(enabled) {
        var self = this;

    	self._upward_enabled = enabled;
    },

    checkLockWindow: function() {
        var self = this;

		for (var i = 0; i < self.stack_num; i++) {
			var w = self.stack[i];
			if (w.LOCK)
				return true;
		}
    	return false;
    },

    //收起所有弹框
    upwardAllPopup: function() {
        var self = this;

        //设置了不能执行上拉操作
        if (self._upward_enabled === false) return;
        //有弹窗设置了锁定界面
        if (self.checkLockWindow()) return;

        if (self.root.getActionByTag(self.ACTION_TAG)) { //如果有其他动作正在进行，打断并直接设置位置，防止动画出错
            self.root.stopActionByTag(self.ACTION_TAG);
            self.root.setPosition(0, cc.winSize.height);
            self._setBgVisible(false);
            self.setTouchLayerEnabled(false);
            self.root.setVisible(false);
            self.root.setLocalZOrder(-1);
            self.status = self.STATUS.UPWARD; //如果有ACTION_TAG动作表面有弹窗存在，把标记置为UPWARD
        } else if (self.checkRemoveBackground() && self.status === self.STATUS.NORMAL) {
            self._setBgVisible(false);
            var action = new cc.Sequence(
                new cc.MoveTo(0.3, cc.p(0, cc.winSize.height)),
                new cc.CallFunc(function() {
                    self.root.setLocalZOrder(-1);
                    self.root.setVisible(false);
                    self.setTouchLayerEnabled(false);
                }));
            action.setTag(self.ACTION_TAG);
            self.root.runAction(action);
            self.status = self.STATUS.UPWARD;
            self.setTouchLayerEnabled(true);
        }

        self.setUpwardStatus(true);
    },

    //拉回所有弹框
    downwardAllPopup: function() {
        var self = this;

        self.root.setVisible(true);
        self.setTouchLayerEnabled(false);
        if (self.root.getActionByTag(self.ACTION_TAG)) { //如果有其他动作正在进行，打断并直接设置位置，防止动画出错
            self.root.stopActionByTag(self.ACTION_TAG);
            self.root.setPosition(0, 0);
            self._setBgVisible(true);
            self.setUpwardStatus(false);
        } else if (self.checkRemoveBackground() && self.status === self.STATUS.UPWARD) {
            self.root.setLocalZOrder(self.zorder);
            var action = new cc.Sequence(
                new cc.MoveTo(0.3, cc.p(0, 0)),
                new cc.CallFunc(function() {
                    self.setUpwardStatus(false);
                    self._setBgVisible(true);
                }));
            action.setTag(self.ACTION_TAG);
            self.root.runAction(action);
        } else {
            self.setUpwardStatus(false);
            self.root.setPosition(0, 0);
        }
        self.status = self.STATUS.NORMAL;
    },

    reset: function() {
        var self = this;

        self.setTouchLayerEnabled(false);
        
        //如果有正在向上拉/向下收的动作，先停止
        if (self.root.getActionByTag(self.ACTION_TAG)) {
            self.root.stopActionByTag(self.ACTION_TAG);
        }

        var y = self.root.getPositionY();
        if (self.status === self.STATUS.UPWARD || y !== 0 || !self.root.isVisible() || self.root.getLocalZOrder() !== self.zorder) {
            self.clean();
            self.status = self.STATUS.NORMAL;
        }
    },

    _setBgVisible: function(visible) {
        var self = this;

        var bg = self.root.getChildByTag(self.BACKGROUND);
        if (bg !== null && bg !== undefined) {
            bg.setVisible(visible);
        }
    },

    //隐藏/移除弹框背景(在弹框关闭时调用)
    checkRemoveBackground: function() {
        var self = this;

        self.setTouchLayerEnabled(false);
        var visible = false;

        for (var i = 0; i < self.stack_num; i++) {
            if (self.stack[i].isVisible()) {
                visible = true;
                break;
            }
        }

        if (visible === false) {
            self._removeBackground(); //如果所有child都不可见,就将背景移除.
        }
        return visible;
    },

    //移除背景
    _removeBackground: function() {
        var self = this;

        if (self.root.getChildByTag(self.BACKGROUND)) {
            self.root.removeChildByTag(self.BACKGROUND);
        }
    },

    //当弹窗层在移动时，覆盖在上面吞噬点触
    setTouchLayerEnabled: function(visible) {
        var self = this;

        if (visible) {
            if (self.touch_layer === null || self.touch_layer === undefined) {
                self.touch_layer = new ccui.Layout();
                self.touch_layer.setContentSize(cc.winSize);
                self.touch_layer.setTouchEnabled(true);
                self.root.addChild(self.touch_layer, 100);
            }
        } else {
            if (self.touch_layer !== null && self.touch_layer !== undefined) {
                self.touch_layer.removeFromParent(true);
                self.touch_layer = null;
            }
        }
    },

    genData: function(args) {
    	var self = this;

    	args = args ? args : {};
    	var cls = args.cls;
    	var show_action_type = args.show_action_type ? args.show_action_type : 0;
    	var show_cb = args.show_cb;
    	var init_data = args.init_data ? args.init_data : {};
    	var show_type = args.show_type ? args.show_type : 0;
    	var show_event = args.show_event;
    	var priority = args.priority ? args.priority : false;

    	init_data.uid = getUID();
    	init_data.show_action_type = show_action_type;

    	var ret = {
    		cls: cls,
    		init_data: init_data,
    		show_cb: show_cb,
    		show_type: show_type,
    		show_event: show_event,
    		priority: priority
    	};

    	return ret;
    },

    push: function(args, index) {
    	var self = this;

    	if (!args) return;

    	if (!args.cls && args.show_type === 0) return;

    	var data = self.genData(args);

    	if (index === undefined || index === null || checkint(index) !== index
    		|| index >= self.queue_num || index < 0) {
    		self.queue.push(data);
    	}
    	else {
    		self.queue.splice(index, 0, data);
        }

    	self.queue_num++;
        
        return data.init_data.uid;
    },
	/*
	pop 取出队列顶端的弹窗数据，并打开相应的弹窗
	    stay 是否延迟执行 如果当前已经有界面在显示了，则stay=true时不再打开新界面
	    逻辑控制
	        先检查stay，如果为true，直接返回
	        再检查可见的界面是否设置了TOP，如果置为TOP=true，直接返回
	*/
    pop: function(stay) {
    	var self = this;

    	stay = stay ? stay : false;

    	if (self.queue_num <= 0 ) return;

    	if (self.stack_num > 0) {
    		var w = self.stack[self.stack_num - 1];

    		if (stay && w.isVisible()) return;

    		if (w.isVisible() && w.TOP) {
    			var t = self.queue[0];
    			if (!t.cls.prototype.TOP)
    				return;
    		}
    	}

    	var t = self.queue.shift();
    	self.queue_num--;

    	if (t.show_type === 0) {
    		self._hide(t);
    		self._unique(t);
    		self._show(t);
    	}
    	else if(t.show_type === 1)
    		qf.event.dispatchEvent(t.show_event, t);
    },
	/*
	_hide 私有方法，外部不能调用
	    新界面被打开，隐藏当前已经显示的界面
	    逻辑控制
	        如果当前界面设置了ALWAYS_SHOW=true 不隐藏当前界面
	*/
    _hide: function(t) {
    	var self = this;

    	if (self.stack_num > 0) {
    		var w = self.stack[self.stack_num - 1];
    		if (!w.ALWAYS_SHOW) {
    			w.hideWithoutAction();
            }
    	}
    },
	/*
	_unique 私有方法，外部不能调用
	    t 要打开界面的数据
	    检查是否存在已经打开的界面与t界面相同，如果相同则移除已经打开的界面
	    逻辑控制
	        如果设置UNIQUE=false，可以存在多个相同的界面
	    在queue队列中未打开的不考虑
	*/
    _unique: function(t) {
    	var self = this;

    	if (self.stack_num > 0) {
    		for (var i = 0; i < self.stack_num; i++) {
    			if (t.cls.prototype._className === self.stack[i]._className
    				&& self.stack[i].UNIQUE) {
    				self.stack[i].removeFromParent(true);

    				self.stack.splice(i, 1);
    				self.stack_num--;
    				break;
    			}
    		}
    	}
    },
    /*
    _show 打开一个界面
	    t 要代码界面的数据
	    创建对象之后要执行reqData请求此界面的数据
        防止在init时请求数据时是使用的本地缓存，直接setData，导致时序错乱
    */
    _show: function(t) {
    	var self = this;

        qf.event.dispatchEvent(ET.EVT_DIALOG_APPEAR);

        //打开一个界面之前先检查弹窗层状态
        self.reset();

    	var handler = new t.cls(t.init_data);

    	self.stack.push(handler);
    	self.stack_num++;

    	handler.reqData();

    	if (t.init_data.show_action_type === 0)
    		handler.showWithoutAction(t.show_cb);
    	else
    		handler.show(t.show_cb);

    	self.root.addChild(handler, 0, handler._get("uid"));
    },
    /*
   _remove 移除界面
	    uid 一个界面的id或者一组界面的id
	    只移除并删除self.stack中的记录
    */
    _remove: function(uid) {
    	var self = this;

    	for (var i = 0; i < self.stack_num; i++) {
            var d = self.stack[i]._get("uid");
    		if ( d === uid) {
    			self.stack[i].removeFromParent(true);

    			self.stack.splice(i, 1);
    			self.stack_num--;
    			break;
    		}
    	}
    },
	/*
	remove 移除一个界面或者一组界面
	    uid 一个界面的id或者一组界面的id
	    一般用在界面的关闭方法中
    */
    remove: function(uid) {
    	var self = this;

    	if (uid instanceof Array) {
    		for (var i = 0; i < uid.length; i++)
    			self._remove(uid[i]);
    	}
    	else
    		self._remove(uid);

    	self.check();
    },
	/*
	_prepare 延迟一帧执行pop
	    只在check中调用
	    延迟一帧进行弹窗创建，防止弹窗之间切换导致卡顿
    */
    _prepare: function() {
    	var self = this;

    	if (self.scheduler_prepare) return;

    	self.scheduler_prepare = performWithGlobal(function(){
    		self.scheduler_prepare = null;
    		self.pop();
    	}, 0)
    },
	/*
	check 检查是否还有下一个界面要展示
	    逻辑控制
	        先检查有没有优先显示的界面
	        再显示隐藏的界面
	        最后pop
	*/
    check: function() {
    	var self = this;

    	if (self.stack_num > 0 && self.stack[self.stack_num - 1].TOP) {
    		var w = self.stack[self.stack_num - 1];
    		w.display();
    	}
    	else if (self.queue_num > 0 && self.queue[0].priority) {
    		self._prepare();
    	}
    	else if (self.stack_num > 0) {
    		var w = self.stack[self.stack_num - 1];
    		w.display();
    	}
    	else if (self.queue_num < 1) {
            qf.event.dispatchEvent(ET.EVT_DIALOG_CLEANED);
    	}
    	else
    		self._prepare();
    }
});

module.exports = PopupManager;
