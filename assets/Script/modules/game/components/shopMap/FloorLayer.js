//楼层
var MapLayer = require("MapLayer");
var EquipmentConfig = require("EquipmentConfig");
var FloorLayer = cc.Class({
    extends: MapLayer,
    properties: {
        _className: {
            default: "FloorLayer",
            override: true
        },
    },

    onLoad: function() {
        this._super();
        //楼层基本配置
        this.mapEnter = [cc.v2(5,0)];     //楼层入口
        this.mapExport = [cc.v2(5,7)];    //楼层出口
    },

    start () {
        this._super();
    },

    //初始化地图
    initMap: function(args, mapManager){
        if(args.floor == 1){
            this.mapEnter = [cc.v2(3, 0), cc.v2(4, 0)]
        }
        this._super(args, mapManager);
    }
});
module.export = FloorLayer;
