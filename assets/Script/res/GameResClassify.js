var GameRes = require("GameRes");
var GameResClassify = {};

//全局通用资源——在启动游戏时就应该被加载
GameResClassify.global = GameRes.pathGlobalScence;

//预加载音效
GameResClassify.preloadAudio = GameRes.pathPreloadMusic;

//loading界面
GameResClassify.loading = GameRes.prefabLoadingScence;

//主界面
GameResClassify.main = GameRes.pathMainScence;

//活动界面
GameResClassify.activity = GameRes.pathActivityView;

//游戏界面
GameResClassify.game = GameRes.pathGameScence;

module.exports = GameResClassify;