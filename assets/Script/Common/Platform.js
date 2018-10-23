/**
* @ 用来获取相应的平台信息或者对相应的平台做出相应的处理
*/

var Platform = {};

Platform.getDeviceId = function() {
    if(cc.sys.OS_ANDROID == cc.sys.os && !cc.sys.browserType){  
        var deviceID = jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxActivity", "getDeviceID", "()Ljava/lang/String;");  
        cc.log("--------- DeviceID ---------------",deviceID);
        return deviceID;
    } 
    if (cc.sys.os == cc.sys.OS_IOS && !cc.sys.browserType) {
        var deviceID = jsb.reflection.callStaticMethod("AppController", "getDeviceID");
        return deviceID;
    }
};

module.exports = Platform;