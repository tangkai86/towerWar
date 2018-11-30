/*
    地图锚点必须在左下角
*/
var AstarMoveType = require('AstarMoveType');
var AstarTile = require("AstarTile");
var Astar = require("Astar");
var AstarMap = cc.Class({
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
        //寻路方向 4方向或8方向
        moveType: {
            default: AstarMoveType.FOUR_DIRECTION,
            type: AstarMoveType
        },
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
        //初始化地图数据
        this.initMapData();
    },

    start: function() {
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
                //astarTile.showDebugDraw(); //显示色块
                verGroup.push(astarTile);
                //cc.log("当前地图块数据为:"+astarTile.position);
            }
            this._astarGroup.push(verGroup);
        }
        cc.log(this._astarGroup);

        //a*寻路
        this.aStar = new Astar(this._astarGroup, this.moveType);
    },

    //初始化点击事件
    initTouchEvent: function() {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // var touchPos = event.touch.getLocation();
            // let location = self.node.convertToNodeSpaceAR(touchPos);
            // cc.log("当前点击坐标:"+location.x + ":"+ location.y);
            // let targetTilePos = self.getTilePosByPosition(location);
            // cc.log("当前地图块坐标:"+targetTilePos);
            // if (targetTilePos.x < 0 || targetTilePos.x >= self.horTiles ||
            //     targetTilePos.y < 0 || targetTilePos.y >= self.verTiles) {
            //     return true;
            // }
            // var player = this.node.getChildByName('Sprite_npc_1');
            // self.moveTo(player, targetTilePos);
            // return true;
        }, self.node);
    },

    moveTo: function(player, finish) {
        if (this.enabledDebugDraw) {
            this._clearDebugColor();
        }
        

        player.stopAllActions();
        var start = this.getTilePosByPosition(player.position);

        //寻路压力测试
        // var curTime = (new Date()).getTime();
        // cc.log("寻路前时间:"+curTime);
        // for(var i=0; i<1000; i++){
        //     var x = Math.floor(Math.random()*8);
        //     var y = Math.floor(Math.random()*8);
        //     this.aStar.moveToward(start, cc.v2(x,y));
        // }
        // var lastTime = (new Date()).getTime();
        // cc.log("寻路后时间:"+lastTime);
        // cc.log("寻路总时间:"+(lastTime-curTime));

        this._paths = this.getMovePathTiles(start, finish);
        if (this._paths.length < 1) {
            cc.log('cannot find path:'+finish.x + " :" + finish.y);
            return;
        }

        //无路可走
        if(this._paths.length <= 1) return;
        let sequence = [];
        for (let i = 1; i < this._paths.length; ++i) {
            let actionPos = this.getCenterByTilePos(this._paths[i].position);
            sequence.push(cc.moveTo(this.stepOfDuration, actionPos));
        }
        if(sequence.length > 1){
            player.runAction(cc.sequence(sequence));
        }else {
            player.runAction(sequence[0]);
        }
    },

    //获取寻路路径
    getMovePathTiles: function(start, finish, findEnd){
        var movePath = this.aStar.moveToward(start, finish, findEnd);
        //显示寻路路径
        if (this.enabledDebugDraw) {
            for (let i = 0; i < this._paths.length; ++i) {
                this._debugDraw(this._paths[i].position, this._debugTileColor, i);
            }
        }
        return movePath;
    },

    //获取瓦片by Pos
    getTileByPos: function(pos){
        if(!this._astarGroup[pos.x] || !this._astarGroup[pos.x][pos.y]) return null;
        var tile = this.aStar.getTileByPos(pos);
        return tile;
    },

    //获取瓦片by Position
    getTileByPosition: function(position){
        var pos = this.getTilePosByPosition(position);
        var tile = this.getTileByPos(pos);
        return tile;
    },

    //判断瓦片是否可以放置
    isTileCanPlaced: function(pos) {
        if(!this._astarGroup[pos.x] || !this._astarGroup[pos.x][pos.y]) return false;
        var tile = this._astarGroup[pos.x][pos.y];
        return tile.isCanPlaced();
    },

    //增加瓦片地形
    addTileBarrier: function(pos){
        var tile = this._astarGroup[pos.x][pos.y];
        tile.addBarrier();
    },

    //移除瓦片地形
    removeTileBarrier: function(pos){
        var tile = this._astarGroup[pos.x][pos.y];
        tile.removeBarrier();
    },

    //判断瓦片是否可通行
    isTileCanCross: function(pos){
        var tile = this._astarGroup[pos.x][pos.y];
        return tile.isCanCross();
    },

    //增加瓦片行人
    addTilePeople: function(pos, people){
        var tile = this._astarGroup[pos.x][pos.y];
        tile.addPeople(people);
    },

    //移除瓦片行人
    removeTilePeople: function(pos, people){
        var tile = this._astarGroup[pos.x][pos.y];
        tile.removePeople(people);
    },

    //获取瓦片行人
    getTilePeople: function(pos){
        var tile = this._astarGroup[pos.x][pos.y];
        tile.getPeople();
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

    getCenterByTilePos: function(pos){
        let tilePosition = this.getPositionByTilePos(pos);
        tilePosition.x += this.tileSize.width*0.5;
        tilePosition.y += this.tileSize.height*0.5;
        return tilePosition;
    },

    //获取瓦片大小
    getTileSize: function(){
        return this.tileSize;
    },

    _clearDebugColor: function(sender) {
        for (let i = 0; i < this._paths.length; ++i) {
            let touchTile = this._paths[i];
            touchTile.hideDebugDraw();
        }
    },
    
    _debugDraw: function(tilePos, color) {
        let drawColor = color || this._debugTileColor;
        let touchTile = this._astarGroup[tilePos.x][tilePos.y];
        touchTile.showDebugDraw(drawColor);
    },
});

module.exports = AstarMap;
