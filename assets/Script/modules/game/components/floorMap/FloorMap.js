/*
    地图锚点必须在左下角
*/
var AstarTile = require("AstarTile");
var Astar = require("Astar");
var FloorMap = cc.Class({
    extends: cc.Component,

    properties: {
        //横向瓦片数
        horTiles: {
            default: 8,
            type: cc.Integer
        },
        //纵向瓦片数
        verTiles: {
            default: 8,
            type: cc.Integer
        },
        //瓦片大小
        tileSize: cc.size(94,94),
        stepOfDuration : {
            default: 0.2,
            type: cc.Float
        },
        enabledDebugDraw: true,
        _astarGroup: []
    },

    onLoad: function() {
        this._debugTileColor = cc.color(255, 187, 255, 255);
        this._paths = [];
    },

    start: function() {
        //初始化地图数据
        this.initMapData();
        //初始化点击事件
        this.initTouchEvent();
    },

    //初始化地图数据
    initMapData: function() {
        //地图数组
        for(var i=0; i<this.horTiles; i++){
            var verGroup = [];  //竖向地图数组
            for(var j=0; j<this.verTiles; j++){
                var astarTile = new AstarTile();
                astarTile.initTile(cc.v2(i, j), this.tileSize, this.node);
                astarTile.showDebugDraw(); //显示色块
                verGroup.push(astarTile);
                //cc.log("当前地图块数据为:"+astarTile.position);
            }
            this._astarGroup.push(verGroup);
        }
        cc.log(this._astarGroup);

        //a*寻路
        this.aStar = new Astar(this._astarGroup);
    },

    //初始化点击事件
    initTouchEvent: function() {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var touchPos = event.touch.getLocation();
            let location = self.node.convertToNodeSpaceAR(touchPos);
            cc.log("当前点击坐标:"+location.x + ":"+ location.y);
            let targetTilePos = self.getTilePosByPosition(location);
            cc.log("当前地图块坐标:"+targetTilePos);
            if (targetTilePos.x < 0 || targetTilePos.x >= self.horTiles || 
                targetTilePos.y < 0 || targetTilePos.y >= self.verTiles) {
                return true;
            }
            self.moveTo(targetTilePos)
            return true;
        }, self.node);
    },

    moveTo: function(finish) {
        if (this.enabledDebugDraw) {
            this._clearDebugColor();
        }
        
        var player = this.node.getChildByName('Sprite_npc_1');
        player.stopAllActions();
        var start = this.getTilePosByPosition(player.position);
        this._paths = this.aStar.moveToward(start, finish);
        if (this._paths.length < 1) {
            cc.log('cannot find path');
            return;
        }

        //显示寻路路径
        for (let i = 0; i < this._paths.length; ++i) {
            this._debugDraw(this._paths[i].position, this._debugTileColor, i);
        }

        //无路可走
        if(this._paths.length <= 1) return;
        let sequence = [];
        let tileSize = this._astarGroup[0][0].tileSize;;
        for (let i = 1; i < this._paths.length; ++i) {
            let actionPos = this.getPositionByTilePos(this._paths[i].position);
            actionPos.x += this.tileSize.width / 2;
            actionPos.y += this.tileSize.width / 2;
            sequence.push(cc.moveTo(this.stepOfDuration, actionPos));
        }
        player.runAction(cc.sequence(sequence));
    },

    //判断当前地图块是否可以放置
    isCanPlaced: function(pos, type) {
        // body...
    },

    getTilePosByPosition: function(pixelPosition) {
        let x = Math.floor(pixelPosition.x / this.tileSize.width);
        let y = Math.floor(pixelPosition.y / this.tileSize.height);
        return cc.v2(x, y);
    },

    getPositionByTilePos: function(pos) {
        let x = pos.x * this.tileSize.width;
        let y = pos.y * this.tileSize.height;
        return cc.v2(x, y);
    },

    _clearDebugColor: function(sender) {
        for (let i = 0; i < this._paths.length; ++i) {
            let touchTile = this._paths[i];
            touchTile.showDebugDraw();
        }
    },
    
    _debugDraw: function(tilePos, color) {
        if (!this.enabledDebugDraw) {
            return;
        }
        
        let touchTile = this._astarGroup[tilePos.x][tilePos.y];
        touchTile.showDebugDraw(color);
    },
});

module.exports = FloorMap;
