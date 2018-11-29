//街道
var StreetManager = cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad: function() {
        // 写死障碍区 后期优化
        this.barrierGroup = 
            [
                cc.v2(0,1), cc.v2(1,1),
                cc.v2(2,1), cc.v2(5,1),
                cc.v2(6,1), cc.v2(7,1),
            ];

        // 进入房间的进入点
        self.enterRoomPos = [cc.v2(3,1), cc.v2(4,1)]
        // 进入场景的进入点
        self.enterScenePos = [cc.v2(0,0), cc.v2(7,0)]

        // 2-5秒内随机个时间创建行人
        // 单位毫秒
        this.minCreatInterval = 3000;
        this.maxCreatInterval = 6000;

        // 是否进入房间 20%的概率
        this.enterPercent = 0.4

        this.aStarMap = this.node.getComponent("AstarMap");

        this.autoAddPlayer();
    },

    start () {
        for (var i = 0; i < this.barrierGroup.length; i++) {
            this.aStarMap.addTileBarrier(this.barrierGroup[i])
        }
    },

    autoAddPlayer(){
        var randomTime = this.minCreatInterval + cc.random0To1() * (this.maxCreatInterval - this.minCreatInterval);
        setTimeout(function(){
            this.addPlayerStreet();
            this.autoAddPlayer();
        }.bind(this), randomTime);
    },

    addPlayerStreet() {
        var prefab = cc.loader.getRes(GameRes.prefabPlayerStreet, cc.Prefab);
        var node = cc.instantiate(prefab);
        node.parent = this.node;
        var playerStreet = node.getComponent("PlayerStreet");
        var isEnterRoom = cc.random0To1() <= this.enterPercent;
        var randomKey = cc.random0To1() >= 0.5 ? 0 : 1
        var endPos = isEnterRoom == true ? self.enterRoomPos[randomKey] : self.enterScenePos[randomKey];

        playerStreet.initPlayer({level: 10, type: 1, x: 0, y: 0});
        // cc.log("xxxxxxxxxxxxxaddPlayerStreet", endPos, randomKey, self.enterRoomPos[0], self.enterScenePos[randomKey]);
        playerStreet.setEndInfo({isEnterRoom: isEnterRoom, endPos: endPos});
        //this.employTab.push(employNode);
    },


});
module.export = StreetManager;
