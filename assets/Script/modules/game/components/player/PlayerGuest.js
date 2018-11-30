var Player = require("Player");
var PlayerGuest = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerGuest",
            override: true
        }
    },

    onLoad(){
        this.purpose = "inShop";
    },

    start () {
        this._super();
    },

    initPlayer: function (args) {
        this.aStarMap = this.node.parent.getComponent("AstarMap");
        //player位置
        let playerPosition = this.aStarMap.getCenterByTilePos(cc.v2(args.x, args.y));
        this.node.setPosition(playerPosition);
        let tile = this.aStarMap.getTileByPos(cc.v2(args.x, args.y));
        tile.addPeople(this.node);
    }
});

module.exports = PlayerGuest;