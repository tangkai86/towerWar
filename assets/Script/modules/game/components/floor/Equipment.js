var Equipment = cc.Class({
    extends: cc.Component,

    properties: {
        level:  1,          //等级
        outPutNum: 100,    //每分钟产出金币数
        placeTile: {       //占位瓦片
            default: cc.v2(1,0)
        },
        _placed: false,  //是否已放置
    },
    
    start () {
        this.initTouchEvent(); //点击事件
    },

    update: function(dt){
        this.node.zIndex = 2000 - this.node.position.y;
        if(!this._placed){
            this.node.zIndex = this.node.zIndex + 10000;
        }
    },

    //初始化点击事件
    initTouchEvent: function() {
        let self = this;
        let touchStart = false;
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            touchStart = true;
            self.packUpEquip();
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            let touchPos = event.touch.getLocation();
            let location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.node.setPosition(location);
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            let touchPos = event.touch.getLocation();
            let location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.setEquipPosition(location);
            //放置设备
            if(self.checkEquipPlace()){
                self.placeEquip();
            }
            touchStart = false;
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            let touchPos = event.touch.getLocation();
            let location = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.setEquipPosition(location);
            //放置设备
            if(self.checkEquipPlace()){
                self.placeEquip();
            }
            touchStart = false;
        }, self.node);
    },

    //初始化设备
    initEquip: function (args) {
        this.aStarMap = this.node.parent.getComponent("AstarMap");

        //初始设备信息
        var equipPosition = this.aStarMap.getCenterByTilePos(cc.v2(args.x, args.y));
        this.setEquipPosition(equipPosition);
        this.node.opacity = 128;

        //放置设备
        if(this.checkEquipPlace()){
            this.placeEquip();
        }
    },

    //放置设备
    placeEquip: function () {
        if(this._placed) return false;
        let canPlace = true;
        //检查瓦片是否可放置
        let equipPosition = cc.v2(this.node.position.x - this.node.getContentSize().width/2, this.node.position.y - this.node.getContentSize().height/2);
        let equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(let i=0; i<this.placeTile.x; i++){
            for(let j=0; j<this.placeTile.y; j++){
                canPlace = this.aStarMap.isTileCanPlaced(cc.v2(equipPos.x + i, equipPos.y + j));
                if(!canPlace){
                    cc.log("瓦片不可放置:"+"x:"+(equipPos.x+i)+ " y:"+(equipPos.y + j));
                    return canPlace;
                }
            }
        }

        //放置设备
        this.node.opacity = 255;
        this._placed = true;
        for(let i=0; i<this.placeTile.x; i++){
            for(let j=0; j<this.placeTile.y; j++){
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
        let equipPosition = this.getEquipPosition();
        let equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(let i=0; i<this.placeTile.x; i++){
            for(let j=0; j<this.placeTile.y; j++){
                this.aStarMap.removeTileBarrier(cc.v2(equipPos.x + i, equipPos.y + j));
            }
        }
    },

    //检查设备是否可放置
    checkEquipPlace: function(){
        var floorLayer = this.node.parent.getComponent("FloorLayer");
        //放置设备
        let canPlace = this.placeEquip();
        if(!canPlace) return false;
        //检查所有设备是否可用
        canPlace = floorLayer.checkEquipsUsefull();
        //收起设备
        this.packUpEquip();
        return canPlace;
    },

    //检查设备是否可使用
    checkEquipUsefull: function () {
        var usefull = false;
        var equipBordersPos = this.getEquipBordersPos();
        for(var i=0; i<equipBordersPos.length; i++){
            var tile = this.aStarMap.getTileByPos(equipBordersPos[i]);
            if(tile && tile.last){
                usefull = true;
                break;
            }
        }
        cc.log("设备不可使用:y:"+this.node.position.y);
        return usefull;
    },

    //获取设备周边瓦片pos
    getEquipBordersPos: function () {
        var equipBorders = [];
        var equipPosition = this.getEquipPosition();
        var equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                var tileBorders = this.getTileBordersPos(cc.v2(equipPos.x + i, equipPos.y + j));
                for(var k=0; k<tileBorders.length; k++){
                    equipBorders.push(tileBorders[k])
                }
            }
        }
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
    },
    
    //获取设备位置: 设备左下角坐标
    getEquipPosition: function () {
        var equipPosition = cc.v2(this.node.position.x - this.node.getContentSize().width/2, this.node.position.y - this.node.getContentSize().height/2);
        return equipPosition;
    }
});

module.exports = Equipment;
