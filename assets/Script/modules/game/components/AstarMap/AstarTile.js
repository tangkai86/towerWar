
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

        debugColor: cc.color(119, 119, 119, 255)
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
    addPeople: function(people){
        this.playerGroup.push(people);
    },

    //移除行人
    removePeople: function(people){
        for(var i=this.playerGroup.length-1; i>=0; i--){
            if(this.playerGroup[i] === people){
                this.playerGroup.splice(i,1);
                //cc.log("瓦片:"+this.position+"行人数:"+this.playerGroup.length);
            }
        }
    },

    //获取行人
    getPeople: function(){
        return this.playerGroup;
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
            this.bgColorLayer.zIndex = -1;
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