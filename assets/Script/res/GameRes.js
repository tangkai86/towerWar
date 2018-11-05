
var GameRes = {};

var prefix = "";

//------------资源文件夹路径-------------
GameRes.pathGlobalScence = prefix + "ui/global";   //公共资源
GameRes.pathMainScence = prefix + "ui/main";		//主界面
GameRes.pathActivityView = prefix + "ui/activity";  //活动界面


//------------资源路径-----------
//公共资源
GameRes.pngGlobalSprite9_2 = prefix + "ui/global/global_sprite9_2";  //9宫格纯白色背景
GameRes.prefabCommonTipView = prefix + "ui/global/common/CommonTipView";    //公共提示弹窗

//主界面
GameRes.prefabMainScence = prefix + "ui/main/MainScence";

//活动界面
GameRes.prefabActivityView = prefix + "ui/activity/ActivityView";

module.exports = GameRes;
