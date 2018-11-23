//装饰
var Equipment = require("Equipment");
var Decorate = cc.Class({
    extends: Equipment,
    properties: {
        _className: {
            default: "Decorate",
            override: true
        }
    },

    start () {
        this._super();
    },

    //检查装饰是否可用
    checkEquipUsefull: function () {
        return true;
    },
});

module.exports = Decorate;