/**
* @ 通用方法类
* */

// 货币类型
var CurrencyType =
{
    1:{name:"coin", icon:"btn_jinbi", atlas: "zhujiemian"}, // 金币
    2:{name:"diamond", icon:"biao_zuanshi", atlas: "zhujiemian"}, // 钻石
    3:{name:"rmb", icon:"tubiao_rmb", atlas: "goumai"}, // 人民币
};

var Database = {
    cache: {},
    getData: function(name, folder) {
        var fileName = name;
        var data = Database.cache[fileName];
        if (data != undefined) {
            cfg[name] = data;
            return data;
        }
        if (!folder) folder = "json/";
        var jsonFile = folder + fileName;
        cc.loader.loadRes(jsonFile, function (error, jsonData) {
            if (error) cc.error(error);
            cfg[name] = jsonData.json;
            Database.cache[fileName] = jsonData.json;
            return data;
        });
    },

    loadJson: function (name, cb, context) {
        cc.loader.loadRes("json/"+name, function(error, jsonData){
            if (error) cc.error(error);
            cfg[name] = jsonData.json;
            if (cb) cb.call(context);
        });
    }
};


module.exports = {
    Database: Database,
    CurrencyType:CurrencyType,
    PosFloor :function (pos) {
        return cc.p(Math.floor(pos.x),Math.floor(pos.y));
    },

    // 获取当前时间格式为年-月-日 时:分:秒
    getCurrentTime: function()
    {
        var date = new Date();
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    },

    // 播放音效
    playSound: function(index, loop, delay)
    {
        //cc.log(cc.find("Room"), "///sagag");
        var flag = loop != null ? loop : false;
        var automanager = cc.find("Room/AudioManage") || cc.find("MainScene/AudioManage");
        if(automanager == null)
        {
            automanager = cc.find("Game/AudioManage");
        }
        if(automanager != null)
        {
            var script = automanager.getComponent("AudioManage");
            return script.playEffect(index, flag, delay);
        }
    },

    // 恢复音效
    resumeMusic: function(index, loop)
    {
        var flag = loop != null ? loop : false;
        var automanager = cc.find("Room/AudioManage") || cc.find("MainScene/AudioManage");
        if(automanager == null)
        {
            automanager = cc.find("Game/AudioManage");
        }
        if(automanager != null)
        {
            var script = automanager.getComponent("AudioManage");
            return script.playEffect(index, flag);
        }
    },

    // 停止音效
    pauseMusic: function()
    {
        var automanager = cc.find("Room/AudioManage") || cc.find("MainScene/AudioManage");
        if(automanager == null)
        {
            automanager = cc.find("Game/AudioManage");
        }
        if(automanager != null)
        {
            var script = automanager.getComponent("AudioManage");
            return script.pauseMusic();
        }
    },

    // 添加一个飘通用tip的方法
    addMoveTips: function(text, time, parent)
    {
        var animTime = time != null ? time : 2;
        var prefab = cc.instantiate(env.node_tip);
        var richText = prefab.getChildByName("richLabel");
        var richLabel = richText.getComponent(cc.RichText);
        richLabel.string = text;
        var animParent = parent != null ? parent : cc.director.getScene().getChildByName('Canvas');
        animParent.addChild(prefab, 1000);
        var action = cc.spawn(cc.moveTo(animTime, cc.p(0, 200)), cc.fadeOut(animTime));
        prefab.runAction(action);
    },

    // 复制到剪切板
    copyToClipBoard: function(text)
    {
        // let input = this.editBox.string;

        const el = document.createElement('textarea');

        el.value = text;

        // Prevent keyboard from showing on mobile
        el.setAttribute('readonly', '');

        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection();
        let originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }

        document.body.appendChild(el);
        el.select();

        // Explicit selection workaround for iOS
        el.selectionStart = 0;
        el.selectionEnd = el.value.length;

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        return success;
    },

    // 获取货币图标spriteFrame
    changeCurrencySpriteFrame: function(spr, currentType)
    {
        var info = this.CurrencyType[parseInt(currentType)];

        cc.loader.loadRes("atlas/"+info.atlas, cc.SpriteAtlas, function (error, res) {
            if (error)
                return;
            spr.spriteFrame =  res.getSpriteFrame(info.icon);
        });
    },

    // 获取货币图标spriteFrame
    changeCurrencySpriteFrameByName: function(spr, currentName)
    {
        var info;
        for(let key in this.CurrencyType)
        {
            var item = this.CurrencyType[key];
            if(item.name == currentName)
            {
                info = item;
                break;
            }
        }
        cc.loader.loadRes("atlas/"+info.atlas, cc.SpriteAtlas, function (error, res) {
            if (error)
                return;
            spr.spriteFrame =  res.getSpriteFrame(info.icon);
        });
    },

    // 时间格式转换成天时分秒格式
    timeFormatConversion: function(time)
    {
        var second = time / 1000; // 计算秒数
        var day = Math.floor(second / (3600 * 24)); // 天数
        second = second - day * 3600 * 24; // 剩余的秒数
        var hour = Math.floor(second / 3600); // 小时
        second = second - hour * 3600; // 剩余秒数
        var min = Math.floor(second / 60); // 分钟数
        second = Math.floor(second - min * 60); // 秒数
        return {"day":day, "hour": hour, "min":min, "second":second}
    },

    // 时间格式转换成倒计时天时分秒格式
    timeFormatConversionTick: function(time)
    {
        var second = time / 1000; // 计算秒数
        var day = Math.floor(second / (3600 * 24)); // 天数
        second = second - day * 3600 * 24; // 剩余的秒数
        var hour = Math.floor(second / 3600); // 小时
        second = second - hour * 3600; // 剩余秒数
        var min = Math.floor(second / 60); // 分钟数
        second = Math.floor(second - min * 60); // 秒数

        if(day < 10)
        {
            day = "0" + day;
        }
        if(hour < 10)
        {
            hour = "0" + hour;
        }
        if(min < 10)
        {
            min = "0" + min;
        }
        if(second < 10)
        {
            second = "0" + second;
        }
        return {"day":day, "hour": hour, "min":min, "second":second}
    },

    // 获取货币图标名
    getCurrencyIconName: function(currentType)
    {
        var name = this.CurrencyType[currentType];
        return name.icon;
    },

    // 添加一个通用的添加小红点的方法（添加不带数字的小红点）
    setRedPoint: function(node, pos)
    {
        var state = this.checkIsContainRedPoint(node);
        if (state)
        {
            var redPoint = cc.instantiate(env.red_point);
            redPoint.setTag(999);
            redPoint.parent = node;
            var position = pos != null ? pos : cc.p(-20, 20);
            redPoint.setPosition(position);
        }
    },

    // 添加一个通用的添加小红点的方法（带数字）
    setRedPointWithNumber: function(node, pos, number)
    {
        var state = this.checkIsContainRedPoint(node);
        if (state)
        {
            var redPoint = cc.instantiate(env.red_point);
            redPoint.setTag(999);
            redPoint.parent = node;
            var position = pos != null ? pos : cc.p(-20, 20);
            redPoint.setPosition(position);
            var num = number != null ? number : 1;
            var script = redPoint.getComponent("RedPoint");
            script.setNumber(num);
        }
        else
        {
            var num = number != null ? number : 1;
            var redPoint  = node.getChildByTag(999);
            var script = redPoint.getComponent("RedPoint");
            script.setNumber(num);
        }
    },

    // 检测该node上是否已经有小红点，如果已经有了，返回FALSE，否则，返回TRUE
    checkIsContainRedPoint: function(node)
    {
        var child = node.getChildByTag(999);
        return child == null;
    },
};