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
    }
});

module.exports = PlayerCat;