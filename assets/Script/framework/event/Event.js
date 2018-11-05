
//返回唯一标识符，仅用于事件定义
var __uuid = 0;
function getUID () {
    __uuid = __uuid + 1;
    return __uuid;
}

var ET = {};

// game Module

//应用逻辑协议 start//
ET.NET_CONNECT_REQ = getUID();
ET.NET_CONNECT_RSP = getUID();
ET.NET_LOGIN_REQ = getUID();
ET.NET_LOGIN_RSP = getUID();

ET.EVT_OPEN_SCENCE_GLOBAL = getUID(); //打开global界面
ET.EVT_OPEN_VIEW_COMMONTIP = getUID();//打开公共提示界面
ET.EVT_OPEN_SCENCE_MAIN = getUID();	  //打开主界面
ET.EVT_OPEN_VIEW_ACTIVITY = getUID(); //打开活动界面
ET.EVT_OPEN_VIEW_SHOP = getUID(); 	  //打开商城界面

module.exports = ET;