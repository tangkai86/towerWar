
var AstarTitle = cc.Class({
    properties: {
        //格子大小
        titleSize: cc.size(94,94),
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
        //方块格子的坐标
        position: cc.Vec2,
        //最短路径的下一个方块格子
        last: AstarTitle,
        //是否有路障
        barrier: {
            set: function(value) {
                this._barrier = value;
            },
            get: function() {
                return this._barrier;
            }
        },
        //格子里的行人
        npcGroup: {
            default: [],
            type: cc.Node
        },

        debugColor: cc.color(255, 187, 255, 255)
    },

    initItem: function(pos, map) {
        this.position = pos;
        this.map = map;
    },

    equalTo(other) {
        if (other instanceof AstarItem) {
            return this.position.equals(other.position);
        }
        return false;
    },

    clearAstar: function() {
        this.weight = 0;
        this.distance = 0;
        this.last = null;
    },

    //是否可通行
    isCanCross: function() {
        return !this.barrier;
    },

    //是否可放置
    isCanPlaced: function() {
        var canPlace = true;
        if(this.barrier)
            canPlace = false;
        if(this.npcGroup.length > 0)
            canPlace = false;
        return canPlace;
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
            this.bgColorLayer.setContentSize(this.titleSize);
        }
        var posX = -this.map.getContentSize().width/2 + (this.position.x + 0.5) * this.titleSize.width;
        var posY = -this.map.getContentSize().height/2 + (this.position.y + 0.5) * this.titleSize.height;
        this.bgColorLayer.position = cc.v2(posX, posY);
        cc.log("坐标:"+this.bgColorLayer.position);
        this.bgColorLayer.active = true;
        this.bgColorLayer.color = bgColor;
    },

    hideDebugDraw: function() {
        if(this.bgColorLayer){
            this.bgColorLayer.active = false;
        }
    }
});

module.exports = AstarTitle;