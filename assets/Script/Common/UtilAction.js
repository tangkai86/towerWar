
module.exports = {
    //对node绑定无限执行动作
    performForever: function(node, callback, duration) {
        var delay = cc.delayTime(duration);
        var seq = cc.sequence(delay, cc.callFunc(callback));
        var action = cc.repeatForever(seq);
        node.runAction(action);
        return action;
    },

    //对node绑定一次性动作
    performWithDelay: function(node, callback, duration) {
        var delay = cc.delayTime(duration);
        var action = cc.sequence(delay, cc.callFunc(callback));
        node.runAction(action);
        return action;
    },

    //对node绑定一系列的延迟动作
    performWithSequence: function(node, block_list) {
        var array = [];
        for (var i = 1; i < block_list.length; i++) {
            array.push(array, cc.delayTime(block_list[i].duration));
            array.push(array, cc.callFunc(block_list[i].cb));
        }

        var action = cc.sequence(array);
        node.runAction(action);
        return action;
    },

    //每间隔interval时长执行一次
    performWithClock: function(node, time, interval, callback) {
        var action = this.performForever(node, function () {
            time = time - interval;
            if (time < 0.0005)
                node.stopAction(action);
            callback(time);
        }, interval);

        return action;
    },

    performWithGlobal: function (callback, duration) {
        var target = GlobalLayer;
        return this.performWithDelay(target, callback, duration);
    },

    performWithGlobalForever: function (callback, duration) {
        var target = GlobalLayer;
        return this.performForever(target, callback, duration);
    },

    stopGlobalAction: function(action) {
        if (action) {
            var target = GlobalLayer;
            target.stopAction(action);
        }
    }
};