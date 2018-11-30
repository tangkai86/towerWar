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
        this.moveToTile(this.getRandomPos(), function () {
            setTimeout(function () {
                self.autoWalk();
            }, 1000);
        })
    },
});

module.exports = PlayerCat;