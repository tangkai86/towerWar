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
    }
});

module.exports = PlayerEmploy;
