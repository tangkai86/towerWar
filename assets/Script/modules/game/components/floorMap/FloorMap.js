var AstarTile = require("AstarTile");
var FloorMap = cc.Class({
    extends: cc.Component,

    properties: {
        //横向格子数
        horTiles: {
            default: 8,
            type: cc.Integer
        },
        //纵向格子数
        verTiles: {
            default: 8,
            type: cc.Integer
            
        },
        _astarGroup: []
    },

    start: function() {
        //初始化地图数据
        this.initMapData();
        //初始化点击事件
        this.initTouchEvent();
        var pos = cc.v2(0,0);
        if(this.isCanCross(pos)){
            cc.log("可以通过");
        }else{
            cc.log("不能通过");
        }
    },

    //初始化地图数据
    initMapData: function() {
        for(var i=0; i<this.horTiles; i++){
            var verGroup = [];  //竖向地图数组
            for(var j=0; j<this.verTiles; j++){
                var astarTile = new AstarTile();
                astarTile.initTile(cc.v2(i, j), this.node);
                astarTile.showDebugDraw(); //显示色块
                verGroup.push(astarTile);
                //cc.log("当前地图块数据为:"+astarTile.position);
            }
            this._astarGroup.push(verGroup);
        }
        cc.log(this._astarGroup);
    },

    //初始化点击事件
    initTouchEvent: function() {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var touchPos = event.touch.getLocation();
            let location = self.node.convertToNodeSpaceAR(touchPos);
            cc.log("当前点击坐标:"+location.x + ":"+ location.y);
            let targetTilePos = self.tilePosistion(location);
            cc.log("当前地图块坐标:"+targetTilePos);
            if (targetTilePos.x < 0 || targetTilePos.x >= self.horTiles || 
                targetTilePos.y < 0 || targetTilePos.y >= self.verTiles) {
                return true;
            }
            var astarTile = self._astarGroup[targetTilePos.x][targetTilePos.y];
            astarTile.showDebugDraw(cc.color(119, 119, 119, 255)); //显示色块
            return true;
        }, self.node);
    },

    //判断当前地图块是否可以通过
    isCanCross: function(pos) {
        var astarTile = this._astarGroup[pos.x][pos.y];
        return astarTile.isCanCross();
    },

    //判断当前地图块是否可以放置
    isCanPlaced: function(pos, type) {
        // body...
    },

    tilePosistion: function(pixelPosition) {
        let mapSize = this.node.getContentSize();
        let tileSize = this._astarGroup[0][0].tileSize;
        let x = Math.floor(pixelPosition.x / tileSize.width);
        let y = Math.floor(pixelPosition.y / tileSize.height);
        return cc.v2(x, y);
    },
});

module.exports = FloorMap;
