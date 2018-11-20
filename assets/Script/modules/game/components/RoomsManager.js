
var FloorLayer = require("FloorLayer");
//地图管理器
var RoomsManager = cc.Class({
    extends: cc.Component,
    properties: {

    },

    start: function(){
        this.roomSize = this.node.getContentSize();
        this.floorTab = [];
    },

    initRoom: function (args) {
        //地板
        var floors = args.floors;
        for(var i=0; i<floors.length; i++){
            var floorNode = this.addFloor(floors[i]);
            floorNode.setPosition(cc.v2(-this.roomSize.width/2, -this.roomSize.height/2 + i*floorNode.getContentSize().height));
            this.floorTab.push(floorNode);
        }
    },

    //增加地板
    addFloor: function (args) {
        var prefab = cc.loader.getRes(GameRes.prefabFloor, cc.Prefab);
        var floorNode = cc.instantiate(prefab);
        floorNode.parent = this.node;
        var floorLayer = floorNode.getComponent("FloorLayer");
        floorLayer.initFloor(args);
        return floorNode;
    }
});

module.exports = RoomsManager;
