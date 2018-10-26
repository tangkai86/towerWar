//事件派发协议
/*
用法:
new EventManager().extendMethods(target);
参数：target 需要添加事件派发协议的对象

target.addEvent(EventName, listener);
增加一条对事件名为EventName的监听，监听触发listener

target.dispatchEvent(EventName, data);
派发一条事件名为EventName的事件，并传递数据为data

target.removeEvent(EventName, Index, listener);
删除一条事件监听
参数：Index 删除编号为Index的事件监听
参数：listener 删除为listener的监听
参数：EventName 删除对事件名为EventName的所有监听

target.hasEvent(EventName)
一个事件名是否还有监听

*/
var EventManager = cc.Class({
	properties: {
        _className: "EventManager"
    },

	ctor: function() {
		this._listeners = {};
		this._nextListenerHandleIndex = 0;
	}
});

(function(){
	var proto = EventManager.prototype;

	proto.parseEventName = function(name) {
		if (name === null || name === undefined) {
			name = this._className + "default";
		}
		else if (typeof name === "number") {
			name = this._className + name;
		}
		else if (typeof name === "object") {
			name = this._className + name.toString();
		}
		return name.toUpperCase();
	};

	//@unique: 此事件只能被同时注册一次
	proto.addEvent = function(name, listener, unique) {
		name = this.parseEventName(name);
	    if (!this._listeners[name]) {
	    	this._listeners[name] = [];
	    }
	    else if (unique) {
	    	this._listeners[name] = [];
	    }

	    this._nextListenerHandleIndex += 1;

	    var index = this._nextListenerHandleIndex;
	    this._listeners[name].push({listener: listener, index: index});
	    return index
	};
	proto.dispatchEvent = function(name, data) {
		name = this.parseEventName(name);

		var listeners = this._listeners[name];
		if (!listeners || listeners.length < 1) return;
		
		data = data || {};
	    data._stop = false;
	    data._eventName = name;
	    data.stop = function() {
	        this._stop = true
	    };

	    var isDispatch = [];
	    for (var i = listeners.length - 1; i >= 0; i--) {
	    	if (listeners[i] && !isDispatch[listeners[i].index]) {
		    	data._eventIndex = listeners[i].index;
		    	isDispatch[listeners[i].index] = true;
		    	listeners[i].listener(data);
		    	if (data._stop) break;
		    }
	    }
	};
	proto.removeEvent = function(name, index, listener) {
		var listeners = this._listeners;
		if (listener || index) {
			for (var k in listeners) {
				for (var i = 0; i < listeners[k].length; i++) {
					if ((index && listeners[k][i].index === index)
						|| (listener && listeners[k][i].listener === listener))
					{
                        listeners[k].splice(i,1);
						break;
					}
				}
			}
		}
		else if (name) {
			name = this.parseEventName(name);
			for (var k in listeners) {
				if (k === name) {
					delete listeners[k];
					break;
				}
			}
		}
	};
	proto.hasEvent = function(name) {
		name = arguments[0];
		name = this.parseEventName(name);
		return this._listeners[name] && this._listeners[name].length > 0;
	};

	proto.extendMethods = function(target) {
		var methods = [
			"addEvent",
			"dispatchEvent",
			"removeEvent",
			"hasEvent"
		];
		target._eventProtocol = this;
		for (var i = 0; i < methods.length; i++) {
			if (!target.hasOwnProperty(methods[i])) {
				(function(methodName){
					target[methodName] = function() {
						var index = target._eventProtocol[methodName].apply(target._eventProtocol, arguments);
						return index;
					};
				})(methods[i]);
			}
		}
	};
})();

module.exports = EventManager;