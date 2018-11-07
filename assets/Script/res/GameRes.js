
var GameRes = {};

var prefix = "";

//------------资源文件夹路径-------------
GameRes.pathGlobalScence = prefix + "ui/global";   //公共资源
GameRes.pathPreloadMusic = prefix + "sound/preload";    //提前预加载音频
GameRes.pathLoadingScence = prefix + "ui/loading"; //loading界面
GameRes.pathMainScence = prefix + "ui/main";		//主界面
GameRes.pathActivityView = prefix + "ui/activity";  //活动界面
GameRes.pathAllMusic = prefix + "sound";    //所有音频文件


//------------资源路径-----------
//公共资源
GameRes.pngGlobalSprite9_2 = prefix + "ui/global/global_sprite9_2";  //9宫格纯白色背景
GameRes.prefabCommonTipView = prefix + "ui/global/common/CommonTipView";    //公共提示弹窗

//loading界面
GameRes.prefabLoadingScence = prefix + "ui/loading/LoadingScence";

//主界面
GameRes.prefabMainScence = prefix + "ui/main/MainScence";

//活动界面
GameRes.prefabActivityView = prefix + "ui/activity/ActivityView";

//音频文件
GameRes.audioBgGame = prefix + GameRes.pathPreloadMusic + "/bg_game"; //背景音乐
GameRes.audioClickBtn = prefix + GameRes.pathPreloadMusic + "/button_click"; //按钮点击

module.exports = GameRes;
