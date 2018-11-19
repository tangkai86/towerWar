var EquipmentType = require("EquipmentType");
var Equipment = require("Equipment");
var FloorLayer = cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        this.equipTab = [];
        this.aStarMap = this.node.getComponent("AstarMap");
        this.floorEnter = [cc.v2(3,0), cc.v2(4,0)];     //楼层入口
        this.floorExport = [cc.v2(3,7), cc.v2(4,7)];    //楼层出口
        //地形设置入口
        for(var i=0; i<this.floorEnter.length; i++){
            var enterPos = this.floorEnter[i];
            var tile = this.aStarMap.getTileByPos(enterPos);
            tile.setSpecialBarrier("enter");
            tile.showDebugDraw();
        }
        //地形设置出口
        for(var i=0; i<this.floorExport.length; i++){
            var exportPos = this.floorExport[i];
            var tile = this.aStarMap.getTileByPos(exportPos);
            tile.setSpecialBarrier("export");
            tile.showDebugDraw();
        }
        cc.log("初始化地图");
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
        Equipment.initEquip(args, this.aStarMap);
        this.equipTab.push(bathNode);
    },

    createEquipLadder: function(args){
        var prefab = cc.loader.getRes(GameRes.prefabEquipLadder, cc.Prefab);
        var ladderNode = cc.instantiate(prefab);
        ladderNode.parent = this.node;
        var Equipment = ladderNode.getComponent("Equipment");
        Equipment.initEquip(args, this.aStarMap);
        this.equipTab.push(ladderNode);
    },

    //增加NPC
    addNpcPlayer: function (args) {

    },

    //检查所有设备是否可用: 检查设备是否可用之前要先寻路一次,对瓦片进行标记
    checkEquipsUsefull: function () {
        var usefull = true;
        for(var i=0; i<this.equipTab.length; i++){
            var equip = this.equipTab[i];
            if(!this.checkEquipUsefull(equip)){
                usefull = false;
                break;
            }
        }
        return usefull;
    },

    //检查单个设备是否可使用
    checkEquipUsefull: function (equipNode) {
        var usefull = false;
        var Equipment = equipNode.getComponent("Equipment");
        var equipBordersPos = Equipment.getEquipBordersPos();
        for(var i=0; i<equipBordersPos.length; i++){
            var tile = this.aStarMap.getTileByPos(equipBordersPos[i]);
            if(tile.last){
                usefull = true;
                break;
            }
        }
        return usefull;
    },

    //检查是否阻碍通行
    checkBlockCross: function () {

    }
});

module.export = FloorLayer;
