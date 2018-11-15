var EquipmentType = require("EquipmentType");
var Equipment = require("Equipment");
var FloorLayer = cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        this.aStarMap = this.node.getComponent("AstarMap");
    },

    //初始化楼层
    initFloor: function(args){
        //初始化设备
        var equips = args.equips;
        for(var i=0; i<equips.length; i++){
            this.addEquip(equips[i]);
        }
    },

    //增加设备
    addEquip: function (args) {
        switch (args.type) {
            case EquipmentType.BATH:
                this.createEquipBath(args);
                break;
            case EquipmentType.LADDER:
                this.createEquipLadder(args);
                break;
        }
    },

    createEquipBath: function(args){
        var prefab = cc.loader.getRes(GameRes.prefabEquipBath, cc.Prefab);
        var bathNode = cc.instantiate(prefab);
        bathNode.parent = this.node;
        var Equipment = bathNode.getComponent("Equipment");
        Equipment.initQuip(args, this.aStarMap);
    },

    createEquipLadder: function(args){
        var prefab = cc.loader.getRes(GameRes.prefabEquipLadder, cc.Prefab);
        var bathNode = cc.instantiate(prefab);
        bathNode.parent = this.node;
        var Equipment = bathNode.getComponent("Equipment");
        Equipment.initQuip(args, this.aStarMap);
    },

    //增加NPC
    addNpcPlayer: function (args) {

    },

    //检查设备是否可用
    checkEquipsUsefull: function () {

    },

    //检查设备是否可使用
    checkEquipUsefull: function () {
        var usefull = false;
        var equipPosition = cc.v2(this.position.x - this.getContentSize().width/2, this.position.y - this.getContentSize().height/2);
        var equipPos = this.aStarMap.getTilePosByPosition(equipPosition);
        for(var i=0; i<this.placeTile.x; i++){
            for(var j=0; j<this.placeTile.y; j++){
                var tileBorders = this.getTileBorders(cc.v2(equipPos.x + i, equipPos.y + j));
                for(var k=0; k<tileBorders.length; k++){
                    var tile = this.aStarMap.getTileByPos(tileBorders[i]);
                    //周围瓦片可以被寻路 则设备可使用
                    if(tile.last){
                        return true;
                    }
                }
            }
        }
    },

    //检查是否阻碍通行
    checkBlockCross: function () {

    }
});

module.export = FloorLayer;
