
var ResourceManager = cc.Class({
	properties: {
        _className: "ResourceManager",
    },

	ctor: function() {
		var self = this;

		self.is_loadded = {};
	}
});

(function() {
	var proto = ResourceManager.prototype;

	//获取指定模块的资源列表
	proto.getResList = function(parent, module) {
		var self = this, ret = [], i;

		if (module === undefined) {
			module = parent;
			parent = qf.classify;
		}

		if (typeof module === "string") {
			ret = clone(parent[module]);

			typeof ret === "string" && (ret = [ret]);
		}
		else if (module instanceof Array) {
			for (i = 0; i < module.length; i++) {
				ret.push.apply(ret, self.getResList(parent, module[i]));
			}
		}
		else if (module instanceof Object) {
			for (i in module) {
				ret.push.apply(ret, self.getResList(parent[i], module[i]));
			}
		}

		return ret;
	};

	proto.genAlias = function(module) {
		var self = this, alias = [];

		if (module === "lobby") {
			alias = ["global"];
		}
		else {
			alias = [module];
		}

		return alias;
	};

	proto.parseModule = function(module) {
		var self = this, modules = [], alias = [], i;

		if (typeof module === "string") {
			modules.push(module);
		}
		else if (module instanceof Array) {
			for (i = 0; i < module.length; i++) {
				modules.push.apply(modules, self.parseModule(module[i]));
			}
		}
		else if (module instanceof Object) {
			for (i in module) {
				modules.push.apply(modules, self.parseModule(module[i]));
			}
		}

		for (i = 0; i < modules.length; i++) {
			alias.push.apply(alias, self.genAlias(modules[i]));
		}

		return alias;
	},

	//预加载资源
	proto.preload = function(module, complete) {
		var self = this;

		var alias = self.parseModule(module);

		complete || (complete = function(){});

		var aysnc = cc.loader.load(self.getResList(alias), function(result, count, loaddedCount) {
			}, function(errors) {
				if (errors && errors.length > 0) {
					setTimeout(function() {
						self.preload(module, complete);
					}, 0.5);
				}
				else {
					self.setLoadded(alias, true);
					if (complete) complete();
				}
			});
		aysnc._limit = 1;
	};

	//加载纹理缓存
	proto.load = function(module, iterator, complete, is_loadding) {
		var self = this;
		iterator || (iterator = function(){});
		complete || (complete = function(){});

		//显示加载百分比
        var funcPercent = function (percent) {
            if (!is_loadding) {
                qf.event.dispatchEvent(ET.EVT_SHOW_GLOBAL_LOADDING, {txt: cc.formatStr(qf.txt.str001, percent)});
            }
        };
        //加载回调
        var iteratorFunc = function (result, count, loaddedCount) {
            if(iterator)iterator(result, count, loaddedCount);
            funcPercent(Math.ceil(loaddedCount/count*100));
        };
        funcPercent(0);	//显示加载百分比为0
		var alias = self.parseModule(module);
		cc.loader.load(self.getResList(alias), function(result, count, loaddedCount) {
			self.loadIterator(result, count, loaddedCount, iteratorFunc);
		}, function(errors) {
			self.loadComplete(errors, module, alias, iteratorFunc, complete);
		});
	};

	//下载的迭代器
	proto.loadIterator = function(result, count, loaddedCount, iterator) {
		var self = this;

		//下载出错
		if (!result) {

		}
		else {
			if (iterator) iterator(result, count, loaddedCount);
		}
	};

	//下载完成的回调
	proto.loadComplete = function(errors, module, alias, iterator, complete) {
		var self = this;

		if (!errors || errors.length < 1) {
			//没有错
	    	qf.event.dispatchEvent(ET.EVT_REMOVE_GLOBAL_LOADDING);

	    	self.setLoadded(alias, true);

			if (complete) complete();
		}
		else {
			//下载出错，延迟0.5s之后重新下载
			setTimeout(function() {
				self.load(module, iterator, complete);
			}, 0.5);
		}
	};

	proto.setLoadded = function(alias, loadded) {
		var self = this;

		if (typeof alias === "string") {
			self.is_loadded[alias] = loadded;
		}
		else {
	    	for (var i = 0; i < alias.length; i++) {
				self.is_loadded[alias[i]] = loadded;
	    	}
	    }

	};
	//获取某个模块是否加载完成
	proto.isLoadded = function(module) {
		var self = this;

		return self.is_loadded[module] || false;
	};

    /**
	 * 释放模块资源
     * @param module_name  模块资源
     * @param ignoreRes 该模块中不释放的资源列表
     */
	proto.releaseRes = function (module_name, ignoreRes) {
		var self = this;
		if(self.isLoadded(module_name)){
            ignoreRes = ignoreRes || [];
            var alias = self.parseModule(module_name);
            var list = self.getResList(alias);
            while(list.length > 0){
                var res = list.pop();
                if(ignoreRes.indexOf(res) === -1){
                    // logd(res, "资源释放中");
                    cc.spriteFrameCache.removeSpriteFramesFromFile(res);
                    cc.textureCache.removeTextureForKey(res);
                    cc.loader.release(res);
                }
            }
            self.setLoadded(module_name, false);
		}
    }
})();

module.exports = ResourceManager;