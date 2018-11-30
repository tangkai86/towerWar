//街道
var MapLayer = require("MapLayer");
var EquipmentConfig = require("EquipmentConfig");
var StreetLayer = cc.Class({
    extends: MapLayer,
    properties: {
        _className: {
            default: "StreetLayer",
            override: true
        }
    },

    onLoad: function() {
        this._super();
        //楼层基本配置
        this.mapEnter = [cc.v2(0,0), cc.v2(0,1)];     //街道入口
        this.mapExport = [cc.v2(7,0), cc.v2(7,1)];    //街道出口
        this.enterRoomPos = [cc.v2(3,1), cc.v2(4,1)];    //营业厅入口
    },

    start () {
        this._super();
    },
    
    //获取营业厅入口
    getShopEnter: function () {
        let index = Util.getRandom(0, this.enterRoomPos.length-1);
        return this.enterRoomPos[index];
    }
});
module.export = StreetLayer;