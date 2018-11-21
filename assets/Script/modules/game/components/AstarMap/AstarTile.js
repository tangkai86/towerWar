
var AstarTile = cc.Class({
    properties: {
        //瓦片大小
        tileSize: cc.size,
        //权重
        weight: {
            default: 0,
            type: cc.Integer
        },
        //与目标的距离x+y
        distance: {
            default: 0,
            type: cc.Integer
        },
        //距离权重
        far: {
            get: function() {
                return this.weight + this.distance;
            }
        },
        //地图节点
        map: cc.Node,
        //瓦片的坐标
        position: cc.Vec2,
        //最短路径的下一个方块格子
        last: AstarTile,
        //路障地形
        barrier: {
            set: function(value) {
                this._barrier = value;
            },
            get: function() {
                return this._barrier;
            }
        },
        //特殊地形,可通过,不可摆放
        specialBarrier: null,
        //格子里的行人
        playerGroup: {
            default: [],
            type: cc.Node
        },
        //格子里的设备投影
        equipShadowGroup: {
            default: [],
            type: cc.Node
        },

        debugColor: cc.color(119, 119, 119),
        enableColor: cc.color(0, 250, 0),
        disenableColor: cc.color(250, 0, 0)
    },

    //初始化瓦片数据
    initTile: function(pos, tileSize, map) {
        this.clearAstar();
        this.position = pos;
        this.tileSize = tileSize;
        this.map = map;
    },

    equalTo(other) {
        if (other instanceof AstarTile) {
            return this.position.equals(other.position);
        }
        return false;
    },

    //清空寻路信息
    clearAstar: function() {
        this.weight = 0;
        this.distance = 0;
        this.last = null;
    },

    //重置瓦片地图
    resetTile: function() {
        this.clearAstar();
        this.barrier = false;
        this.playerGroup = [];
    },

    //是否可放置
    isCanPlaced: function() {
        var canPlace = true;
        if(this.barrier)
            canPlace = false;
        if(this.playerGroup.length > 0)
            canPlace = false;
        if(this.specialBarrier)
            canPlace = false;
        return canPlace;
    },

    //设置特殊地形
    setSpecialBarrier: function(name){
        this.specialBarrier = name;
    },

    //增加地形
    addBarrier: function(){
        this.barrier = true;
    },

    //移除地形
    removeBarrier: function(){
        this.barrier = false;
    },

    //是否可通行
    isCanCross: function() {
        return !this.barrier;
    },

    //增加行人
    addPeople: function(peopleNode){
        this.playerGroup.push(peopleNode);

        //改变enable着色
        if(this.equipShadowGroup.length > 0){
            this.showEnableDraw(this.disenableColor);
        }
    },

    //移除行人
    removePeople: function(peopleNode){
        for(var i=this.playerGroup.length-1; i>=0; i--){
            if(this.playerGroup[i] === peopleNode){
                this.playerGroup.splice(i,1);
                //cc.log("瓦片:"+this.position+"行人数:"+this.playerGroup.length);
            }
        }

        //改变enable着色
        if(this.playerGroup.length <= 0 && this.equipShadowGroup.length > 0){
            this.showEnableDraw(this.enableColor);
        }
    },

    //获取行人
    getPeople: function(){
        return this.playerGroup;
    },

    //增加设备投影
    addEquipShadow: function(equipNode){
        this.equipShadowGroup.push(equipNode);

        //显示enable着色
        if(this.isCanPlaced()){
            this.showEnableDraw(this.enableColor);
        }else {
            this.showEnableDraw(this.disenableColor);
        }
    },

    //移除设备投影
    removeEquipShadow: function(equipNode){
        for(var i=this.equipShadowGroup.length-1; i>=0; i--){
            if(this.equipShadowGroup[i] === equipNode){
                this.equipShadowGroup.splice(i,1);
                //cc.log("瓦片:"+this.position+"设备投影数:"+this.equipShadowGroup.length);
            }
        }
        //隐藏enalbe着色
        if(this.equipShadowGroup.length <= 0){
            this.hideEnableDraw();
        }
    },

    showEnableDraw: function(color){
        var enableColor = color || this.enableColor;
        //背景
        if(!this.enableColorLayer){
            this.enableColorLayer = new cc.Node();
            var spr = this.enableColorLayer.addComponent(cc.Sprite);
            spr.type = cc.Sprite.Type.SLICED;
            spr.spriteFrame = cc.loader.getRes(GameRes.pngGlobalSprite9_2, cc.SpriteFrame);
            this.enableColorLayer.parent = this.map;
            this.enableColorLayer.zIndex = 0.2;
            this.enableColorLayer.setContentSize(this.tileSize);
        }
        var posX = (this.position.x + 0.5) * this.tileSize.width;
        var posY = (this.position.y + 0.5) * this.tileSize.height;
        this.enableColorLayer.position = cc.v2(posX, posY);
        this.enableColorLayer.active = true;
        this.enableColorLayer.color = enableColor;
    },

    hideEnableDraw: function(){
        if(this.enableColorLayer){
            this.enableColorLayer.active = false;
        }
    },

    showDebugDraw: function(color) {
        var bgColor = color || this.debugColor;
        //背景
        if(!this.bgColorLayer){
            this.bgColorLayer = new cc.Node();
            var spr = this.bgColorLayer.addComponent(cc.Sprite);
            spr.type = cc.Sprite.Type.SLICED;
            spr.spriteFrame = cc.loader.getRes(GameRes.pngGlobalSprite9_2, cc.SpriteFrame);
            this.bgColorLayer.parent = this.map;
            this.bgColorLayer.zIndex = 0.1;
            this.bgColorLayer.setContentSize(this.tileSize);
        }
        var posX = (this.position.x + 0.5) * this.tileSize.width;
        var posY = (this.position.y + 0.5) * this.tileSize.height;
        this.bgColorLayer.position = cc.v2(posX, posY);
        this.bgColorLayer.active = true;
        this.bgColorLayer.color = bgColor;
    },

    hideDebugDraw: function() {
        if(this.bgColorLayer){
            this.bgColorLayer.active = false;
            this.bgColorLayer.color = this.debugColor;
        }
    }
});

module.exports = AstarTile;