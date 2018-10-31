
var GameResClassify = require("GameResClassify");
var ResourceManager = cc.Class({
	properties: {
        _className: "ResourceManager",
    },

	ctor: function() {
		var self = this;
		self._netResMd5Tab = null;   //网络资源md5文件列表
		self._loadResMd5Tab = null;  //已下载资源md5文件列表
		self.is_loadded = {};
	}
});

(function() {
	var proto = ResourceManager.prototype;
	proto.parseModule = function(module) {
		var self = this, modules = [], alias = [], i = 0;
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
			alias.push(GameResClassify[modules[i]]);
		}

		return alias;
	},

	//加载纹理缓存
	proto.load = function(module, iterator, complete) {
		var self = this;
        var alias = self.parseModule(module);
    	var i = 0;
        var loadRes = function(resPath) {
        	cc.log("加载资源路径:"+resPath);
        	cc.loader.loadResDir(resPath, function(completedCount, totalCount, item) {
			if(iterator) iterator(completedCount, totalCount, item);
				
	        }, function(errors, resource, urls) {
	        	console.log(resource);
	            if (errors && errors.length > 0) {
	                setTimeout(function() {
	                    self.load(module, iterator, complete);
	                }, 500);
	            }
	            else {
	            	cc.log("加载资源完成:"+resPath)
	            	self.setLoadded(resPath, true);
	            	i++;
	            	if(i >= alias.length){
	            		if (complete) complete();
	            	}else{
	            		loadRes(alias[i]);
	            	}
	            }
	        });
        }
    	loadRes(alias[i]);
	};
	
	//下载微信资源
    proto.wxDownLoadFile = function (resList, iteratorCb, completeCb) {
        var self = this;
        loge("开始下载模块");
        console.log(resList);
        var downWxRes = false;
        var resLength = resList.length;
        var index = 0;
        //文件下载成功回调
        var loadFileSuccess = function (continuCb, netUrl) {
            index = index + 1;
            //文件下载进度
            if(index < resLength){
                if(iteratorCb) iteratorCb(index, resLength, netUrl);
                continuCb();
            }else {
                //所有资源都下载完成，加载资源到内存
                cc.loader.load(resList, function(completedCount, totalCount, item) {
                    //加载进度
                }, function(errors) {
                	loge("模块加载完成");
                	console.log(resList);
                	///加载完成, 有下载新的文件，写入本地md5文件
                	if(downWxRes){
                        self.writeLoadResMd5(GameRes.loadResMd5Path, self._loadResMd5Tab, function () {
                            if(completeCb) completeCb(errors);
                        })
                    }else {
                        if(completeCb) completeCb(errors);
                    }
                });
            }
        };
        var wxLoadFile = function () {
        	var wxResPath = resList[index];
            var netUrl = Util.getWxResUrl(wxResPath);
        	//loge("下载资源:"+netUrl+" 微信路径:"+wxResPath);
        	var startDownLoad = function () {
                wx.downloadFile({
                    url: netUrl,  // 这里是远程文件目录
                    header: {'content-type': 'application/json'},
                    filePath: wxResPath,
                    success: function (res){
                        //console.log('资源下载成功', res);
                        downWxRes = true;
                        var relativePath = Util.getWxResRelativePath(wxResPath);
                        self._loadResMd5Tab[relativePath] = self._netResMd5Tab[relativePath];
                        loadFileSuccess(function () {
                            wxLoadFile();
                        }, netUrl)
                    },
                    fail: function (error) {
                        setTimeout(function(){
                            wxLoadFile();
                        }, 500);
                    }
                });
            };

            //本地文件直接加载
            if(netUrl.substr(0, 4) !== "http"){
                loadFileSuccess(function () {
                    wxLoadFile();
                }, netUrl)
			}else {
            //网络文件
                var relativePath = Util.getWxResRelativePath(wxResPath);
                if(self._loadResMd5Tab[relativePath] === self._netResMd5Tab[relativePath]){
                    //本地缓存文件已经存在
                    loadFileSuccess(function () {
                        wxLoadFile();
                    }, netUrl)
                }else {
                    //本地缓存文件不存在，开始下载
                    startDownLoad();
                }
			}
        };
        wxLoadFile(); //开启下载
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
		return self.is_loadded[GameResClassify[module]] || false;
	};

	//读取网络md5文件并对比已下载资源loadResMd5.txt文件
	proto.checkLoadResMd5 = function (completeCb) {
		var self = this;
		if(!window.wx){
            completeCb();
            return;
        }
        cc.loader.loadTxt(GameRes.netResMd5Path, function (err, netResMd5Txt) {
            if (err)
                return completeCb(err);
            //读取网络资源md5文件
            self._netResMd5Tab = Util.getResMd5List(netResMd5Txt);
            loge("解析好的md5列表为:");
            console.log(self._netResMd5Tab);

            //读取已下载资源的md5文件
            cc.loader.loadTxt(GameRes.loadResMd5Path, function (err, netResMd5Txt) {
                self._loadResMd5Tab = {};
                //读取已下载资源md5错误,设置本地md5文件为空字符串
                if(!err){
                    self._loadResMd5Tab = Util.getResMd5List(netResMd5Txt);
                }
                loge("解析好的本地md5列表为:");
                console.log(self._loadResMd5Tab);
                //删除多余的本地文件
                self.deleteLocalFiles(self._netResMd5Tab, self._loadResMd5Tab, function () {
                    loge("删除多余的本地文件完成");
                    //更新本地md5文件
                    self.writeLoadResMd5(GameRes.loadResMd5Path, self._loadResMd5Tab, function () {
                        loge("更新存储本地md5文件完成");
                        //创建网络资源文件的本地资源目录
                        self.createLocalDirs(self._netResMd5Tab, function () {
                            loge("创建本地资源目录完成");
                            completeCb();
                        });
                    });
                });
            })
        });
    };
	
	//删除多余的本地文件
    proto.deleteLocalFiles = function (netResMd5Tab, loadResMd5Tab, completeCb) {
        var self = this;
        //统计已下载的本地文件数量
        var fileCount = 0;
        for(var i in loadResMd5Tab){
            fileCount = fileCount + 1;
        }

        //已下载的本地文件数量为0，则直接完成
        if(fileCount <= 0){
            completeCb();
            return;
        }

        //检测并删除本地文件回调
        var checkFileCb = function () {
            fileCount = fileCount - 1;
            if(fileCount <= 0){
                completeCb();
            }
        };

        //删除与网络文件不匹配的本地文件
        for(var i in loadResMd5Tab){
            var resMd5 = loadResMd5Tab[i];
            if(!netResMd5Tab[i] || resMd5 !== netResMd5Tab[i]){
                (function (index) {
                    var wxRes = qf.platform.getLocalResPath()+"/"+index;
                    qf.platform.removeFile(wxRes, function (res) {
                        delete loadResMd5Tab[index];
                        checkFileCb();
                    })
                })(i);
            }else {
                checkFileCb();
            }
        }
    };
	
	//创建本地资源目录
    proto.createLocalDirs = function (resPaths, completeCb) {
        var self = this;
        //创建资源目录
        var resDirTab = {};
        for(var i in resPaths){
            var resDir = /(.*)\//.exec(i)[0];
            if(!resDirTab[resDir]){
                resDirTab[resDir] = 1;
            }
        }
        loge("目前的资源目录是:");
        console.log(resDirTab);
        var dirLength = 0;
        for(var i in resDirTab){
            dirLength = dirLength + 1;
        }

        //要创建的资源目录数等于0，则直接完成
        if(dirLength <= 0){
            completeCb();
            return;
        }

        //创建目录回调
        var makeDirCb = function () {
            dirLength = dirLength - 1;
            if(dirLength <= 0){
                completeCb();
            }
        };

        //创建目录
        for(var j in resDirTab){
            (function (index) {
                qf.platform.makeDir(j, function () {
                    makeDirCb();
                })
            })(j);
        }
    };

	//存储已下载资源的md5列表
    proto.writeLoadResMd5 = function (filePath, fileObj, completeCb) {
        var self = this;
        var writeMd5String = "";
        for(var j in fileObj){
            writeMd5String = writeMd5String + fileObj[j]+"|"+j+"\n";
        }
        qf.platform.writeFile(filePath, writeMd5String, function (res) {
            if(res){
                loge("存储md5文件失败");
                console.log(res);
            }
            completeCb();
        } )
    }

})();

module.exports = ResourceManager;