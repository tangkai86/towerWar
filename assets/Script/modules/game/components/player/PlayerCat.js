var Player = require("Player");
var PlayerCat = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerCat",
            override: true
        }
    },

    start () {
        this._super();
    },

    //自由移动
    autoWalk: function () {
        var self = this;
        var tileX = Math.floor(Math.random()*this.aStarMap.horTiles);
        var tileY = Math.floor(Math.random()*this.aStarMap.verTiles);
        this.moveToTile(cc.v2(tileX, tileY), function () {
            setTimeout(function () {
                let FloorLayer = self.node.parent.getComponent("FloorLayer");
                FloorLayer.removePlayerCat(self.node);
            }, 1000);
        })
    },
});

module.exports = PlayerCat;