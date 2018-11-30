var Player = require("Player");
var PlayerStreet = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerEmploy",
            override: true
        }
    },

    onLoad(){
        this._super();
        
        // 在场景中的拐点数目，最后一个点要么是入口，要么是离开地图的出口
        var minPointStep = 2;
        var maxPointCount = 4;
        this.curStep = 1;
        this.pathPointStep = minPointStep + Math.floor(cc.random0To1() * (maxPointCount - minPointStep));
    },

    start () {
        this._super();
    },

    release() {
        this.node.active = false;
    },

    //更新动画方向
    updateFlip: function(curTile, nextTile){
        if(nextTile.position.x > curTile.position.x){
            this.node.scaleX = -1;
        }else if(nextTile.position.x < curTile.position.x) {
            this.node.scaleX = 1;
        }
    },

    //自由移动
    autoWalk: function () {
        if (this.curStep <= this.pathPointStep) {
            var self = this;
            var tileX = Math.floor(Math.random()*this.aStarMap.horTiles);
            var tileY = 0 //
            var nextPos = cc.v2(tileX, tileY);
            // 最后一步
            var isLastStep = this.curStep == this.pathPointStep
            if (isLastStep){
                if (self.endInfo == null) {
                    return
                };

                nextPos = self.endInfo.endPos;
            };

            this.moveToTile(nextPos, function () {
                if (isLastStep) {
                    self.release();
                }else{
                    setTimeout(function () {
                        self.autoWalk();
                    }, 1000);
                }
            });

            this.curStep += 1;
        }else{
            this.release();
        }
    },

    setEndInfo:function (endInfo) {
        this.endInfo = endInfo;
    },
});

module.exports = PlayerStreet;