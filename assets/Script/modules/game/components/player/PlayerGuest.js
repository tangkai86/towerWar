var Player = require("Player");
var PlayerGuest = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerGuest",
            override: true
        }
    },

    start () {
        this._super();
    }
});

module.exports = PlayerGuest;