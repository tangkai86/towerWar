var AstarMap = require("AstarMap");
var FloorLayer = require("FloorLayer");
var Equipment = cc.Class({
    extends: cc.Component,

    properties: {
        level:  1,          //等级
        outPutNum: 100,    //每分钟产出金币数
        placeTile: {       //占位瓦片
            default: cc.v2(1,0)
        },
        _placed: false,  //是否已放置
        aStarMap: AstarMap,
        floorLayer: cc.Node
    },
    
    start () {
        this.initTouchEvent(); //点击事件
    },

    //初始化点击事件
    initTouchEvent: function() {
        var self = this;
        var touchStart = false;
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            touchStart = true;
            self.packUpEquip();
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touchPos = event.touch.getLocation();
            var location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.node.setPosition(location);
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var touchPos = event.touch.getLocation();
            var location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.setEquipPosition(location);
            touchStart = false;
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var touchPos = event.touch.getLocation();
            var location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.setEquipPosition(location);
            touchStart = false;
        }, self.node);
    },

    initEquip: function (args, floorNode) {
        this.aStarMap = floorNode.getComponent("AstarMap");
        this.floorLayer = floorNode.getComponent("FloorLayer");
    },

    //放置设备
    placeEquip: function () {
        if(this._placed) return false;
        var canPlace = true;
        //检查瓦片是否可放置
        var equipPosition = cc.v2(this.node.position.x - this.node.getContentSize().width/2, this.node.position.y - this.node.getContentSize().height/2);
        var equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                canPlace = this.aStarMap.isTileCanPlaced(cc.v2(equipPos.x + i, equipPos.y + j));
                if(!canPlace){
                    return canPlace;
                }
            }
        }

        //放置设备
        this.node.opacity = 255;
        this._placed = true;
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                this.aStarMap.addTileBarrier(cc.v2(equipPos.x + i, equipPos.y + j));
            }
        }
        return canPlace;
    },

    //收起设备
    packUpEquip: function () {
        if(!this._placed) return;
        this._placed = false;
        this.node.opacity = 128;
        var equipPosition = cc.v2(this.node.position.x - this.node.getContentSize().width/2, this.node.position.y - this.node.getContentSize().height/2);
        var equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                this.aStarMap.removeTileBarrier(cc.v2(equipPos.x + i, equipPos.y + j));
            }
        }
    },

    //检查设备是否可放置
    checkEquipPlace: function(){
        //放置设备
        var canPlace = this.placeEquip();
        if(!canPlace) return false;
        //检查是否阻碍通行
        canPlace = this.floorLayer.checkEquipsUsefull();
        //收起设备
        this.packUpEquip();

        return canPlace;
    },

    //获取设备周边瓦片pos
    getEquipBordersPos: function () {
        var equipBorders = [];
        var equipPosition = cc.v2(this.position.x - this.getContentSize().width/2, this.position.y - this.getContentSize().height/2);
        var equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                var tileBorders = this.getTileBordersPos(cc.v2(equipPos.x + i, equipPos.y + j));
                for(var k=0; k<tileBorders.length; k++){
                    equipBorders.push(tileBorders[k])
                }
            }
        }
        cc.log("设备及周边瓦片Pos:"+equipBorders);
        return equipBorders;
    },

    //获取瓦片周边瓦片
    getTileBordersPos: function(pos) {
        var borders = [];

        // top
        let top = cc.v2(pos.x, pos.y + 1);
        borders.push(top);

        // bottom
        let bottom = cc.v2(pos.x, pos.y - 1);
        borders.push(bottom);

        // left
        let left = cc.v2(pos.x - 1, pos.y);
        borders.push(left);
        hasLeft = true;

        // right
        let right = cc.v2(pos.x + 1, pos.y);
        borders.push(right);
        return borders;
    },

    //设置设备位置
    setEquipPosition: function (position) {
        var posx = position.x - this.node.getContentSize().width/2;
        var posy = position.y - this.node.getContentSize().height/2;
        var equipPos = this.aStarMap.getTilePosByPosition(cc.v2(posx, posy));
        if(equipPos.x <0) equipPos.x = 0;
        if(equipPos.x >this.aStarMap.horTiles-this.placeTile.x) equipPos.x = this.aStarMap.horTiles-this.placeTile.x;
        if(equipPos.y <0) equipPos.y = 0;
        if(equipPos.y >this.aStarMap.verTiles-this.placeTile.y) equipPos.y = this.aStarMap.verTiles-this.placeTile.y;
        var tilePosition = this.aStarMap.getPositionByTilePos(equipPos);
        var equipPositionX = tilePosition.x  + this.node.getContentSize().width/2;
        var equipPositionY = tilePosition.y  + this.node.getContentSize().height/2;
        this.node.setPosition(cc.v2(equipPositionX, equipPositionY));

        this.placeEquip();
    }
});

module.exports = Equipment;
