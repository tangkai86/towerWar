/**
* @ 通用方法类
* */
module.exports = {
    //随机数（包含start 和 end）
    getRandom: function(start, end){
        var length = end - start + 1;
        var num = parseInt(Math.random() * (length) + start);
        return num;
    },

    // 获取当前时间格式为年-月-日 时:分:秒
    getCurrentTime: function()
    {
        var date = new Date();
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
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
    }
};