//员工
var Player = require("Player");
var PlayerEmploy = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerEmploy",
            override: true
        }
    },

    start () {
        this._super();
    },

    //更新动画方向
    updateFlip: function(curTile, nextTile){
        if(nextTile.position.x > curTile.position.x){
            this.node.scaleX = -1;
        }else if(nextTile.position.x < curTile.position.x) {
            this.node.scaleX = 1;
        }
    },
});

module.exports = PlayerEmploy;
