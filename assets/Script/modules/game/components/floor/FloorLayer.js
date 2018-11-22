var EquipmentConfig = require("EquipmentConfig");
var FloorLayer = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function() {
        this.equipTab = [];     //设备
        this.employTab = [];    //店员
        this.guestTab = [];     //顾客
        this.catTab = [];       //猫咪

        this.aStarMap = this.node.getComponent("AstarMap");

        //楼层基本配置
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
    },

    start () {

    },

    //初始化楼层
    initFloor: function(args){
        //初始化店员
        var employs = args.employs || [];
        for(var i=0; i<employs.length; i++){
            this.addPlayerEmploy(employs[i]);
        }

        //初始化顾客
        var guests = args.guests || [];
        for(var i=0; i<guests.length; i++){
            this.addPlayerGuest(guests[i]);
        }

        //初始化猫咪
        var cats = args.cats || [];
        for(var i=0; i<cats.length; i++){
            this.addPlayerCat(cats[i]);
        }

        //初始化设备
        var equips = args.equips || [];
        for(var i=0; i<equips.length; i++){
            this.addEquip(equips[i]);
        }
    },

    //增加设备
    addEquip: function (args) {
        var prefab = cc.loader.getRes(EquipmentConfig.PREFAB[args.type], cc.Prefab);
        var equipNode = cc.instantiate(prefab);
        equipNode.parent = this.node;
        var equipment = equipNode.getComponent("Equipment");
        equipment.initEquip(args);
        this.equipTab.push(equipNode);
    },

    //增加店员
    addPlayerEmploy: function (args) {
        var prefab = cc.loader.getRes(GameRes.prefabPlayerEmploy, cc.Prefab);
        var employNode = cc.instantiate(prefab);
        employNode.parent = this.node;
        var playerEmploy = employNode.getComponent("PlayerEmploy");
        playerEmploy.initPlayer(args);
        this.employTab.push(employNode);
    },

    //增加猫咪
    addPlayerCat: function(args){

    },

    //增加顾客
    addPlayerGuest: function(args){

    },

    //检查所有设备是否可用: 检查设备是否可用之前要先寻路一次,对瓦片进行标记
    checkEquipsUsefull: function () {
        //以入口为原点寻路到出口, 遍历所有的瓦片
        var enterPos = this.floorEnter[0];
        var exportPos = this.floorExport[0];
        this.aStarMap.getMovePathTiles(enterPos, exportPos, false);
        console.log(this.aStarMap._astarGroup);

        var usefull = true;
        //设备是否可用
        for(var i=0; i<this.equipTab.length; i++){
            var equipNode = this.equipTab[i];
            var Equipment = equipNode.getComponent("Equipment");
            if(!Equipment.checkEquipUsefull()){
                usefull = false;
                return usefull;
            }
        }

        //人物是否可以正常通行
        usefull = this.checkBlockCross();
        return usefull;
    },

    //人物是否可以正常通行
    checkBlockCross: function () {
        //出口是否可以抵达
        for(let i=0; i<this.floorExport.length; i++){
            var exportPos = this.floorExport[i];
            var tile = this.aStarMap.getTileByPos(exportPos);
            if(!tile.last){
                cc.log("出口不可达");
                return false;
            }
        }

        //所有店员是否能抵达出入口
        for(let i=0; i<this.employTab.length; i++){
            var employNode = this.employTab[i];
            var tile = this.aStarMap.getTileByPosition(employNode.position);
            if(!tile.last){
                cc.log("店员不可抵达出入口");
                return false;
            }
        }

        //所有顾客是否能抵达出入口
        for(let i=0; i<this.guestTab.length; i++){
            var guestNode = this.guestTab[i];
            var tile = this.aStarMap.getTileByPosition(guestNode.position);
            if(!tile.last){
                cc.log("顾客不可抵达出入口");
                return false;
            }
        }

        //所有猫咪是否可以抵达出入口
        for(let i=0; i<this.catTab.length; i++){
            var catNode = this.catTab[i];
            var tile = this.aStarMap.getTileByPosition(catNode.position);
            if(!tile.last){
                cc.log("猫咪不可抵达出入口");
                return false;
            }
        }
        return true;
    }
});
module.export = FloorLayer;
