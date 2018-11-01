/*
PopupManager 弹窗管理器
*/

var PopupManager = cc.Class({
    properties: {
        _className: "PopupManager",
    },

    ctor: function () {
        this.initData();
    },

    initData: function() {
        this._popViewId = 0;
    	this._queue = [];
    	this._stack = [];
    },

    //将弹窗加入到队列
    push: function(popView) {
        this._popViewId = this._popViewId + 1;
        popView.setPopViewId(this._popViewId);
        popView.setActive(false);
    	this._queue.push(popView);
        return this._popViewId;
    },

	//显示队列底部弹窗
    pop: function() {
    	if (this._queue.length <= 0 ) return;

    	if (this._stack.length > 0) {
    		var popView = this.stack[this._stack.length - 1];
            if(!popView.isAlwaysShow()){
                popView.setActive(false)
            }
    	}

    	var popView = this._queue.shift();
        this._stack.push(popView);
    	this.showView(popView);
    },
	
    //隐藏弹窗界面
    hidePopView: function() {
    	for (var i = 0; i < this._stack.length; i++) {
            this._stack[i].setActive(false);
        }
    },

    //显示弹窗界面
    showPopView: function() {
        //显示顶部弹窗
        if (this._stack.length > 0) {
            var popView = this._stack[this._stack.length - 1];
            popView.setActive(true);
        }

        //显示alwaysShow弹窗
        for (var i = 0; i < this._stack.length; i++) {
            var popView = this._stack[i];
            if(popView.isAlwaysShow()){
                popView.setActive(true);
            }
        }
    },
	
    /*
    showView 打开一个界面
	    popView 要代码界面的数据
	    创建对象之后要执行reqData请求此界面的数据
        防止在init时请求数据时是使用的本地缓存，直接setData，导致时序错乱
    */
    showView: function(popView) {
    	popView.reqData();
    	popView.show();
    },
	/*
	removeView 移除一个界面或者一组界面
	    popViewId 一个界面的id或者一组界面的id
	    一般用在界面的关闭方法中
    */
    removeView: function(popViewId) {
    	var self = this;
        //移除弹窗
        var removePopView = function(id) {
            for (var i = self._stack.length - 1; i >= 0; i--) {
                if (id === self._stack[i].getPopViewId()) {
                    self._stack[i].destroyNode();
                    self._stack.splice(i, 1);
                }
            }
        };

        //判断参数类型
    	if (popViewId instanceof Array) {
    		for (var i = 0; i < popViewId.length; i++)
    			removePopView(popViewId[i]);
    	}
    	else
    		removePopView(popViewId);

        //显示新的弹窗
        if (self._stack.length > 0) {
            var popView = self._stack[self._stack.length - 1];
            popView.setActive(true);
        }
    },

    getPopupWindow: function(id) {
        var self = this;
        for (var i=0; i<this._stack.length; i++) {
            if (self._stack[i].getPopViewId() === id)
                return self._stack[i];
        }
        return null;
    },

    removeAllPopView: function() {
        this.removeAllChilden();
    },

    removeAllChilden: function(id) {
        var self = this;
        for (var i = self._queue.length - 1; i >= 0; i--) {
            self._queue[i].destroyNode();
            self._queue.splice(i, 1);
        }
        for (var i = self._stack.length - 1; i >= 0; i--) {
            if (!id || id !== self._stack[i].getPopViewId()) {
                self.removeView(self._stack[i].getPopViewId())
            }
        }
    }
});

module.exports = PopupManager;
