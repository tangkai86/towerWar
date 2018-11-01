var GameRes = require("GameRes");
var GameResClassify = {};
GameResClassify.loadding = [
	// GameRes.loaddingJson,
	// GameRes.loaddingPlist,
	// GameRes.loaddingPng,
];

//全局通用资源——在启动游戏时就应该被加载
GameResClassify.global = [
    
];

//主界面
GameResClassify.main = GameRes.pathMainScence;

//活动界面
GameResClassify.activity = GameRes.pathActivityView;

//游戏界面
GameResClassify.game = [

];

module.exports = GameResClassify;