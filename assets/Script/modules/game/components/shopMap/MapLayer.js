//地图基类: 楼层, 街道社保,人员管理
var EquipmentConfig = require("EquipmentConfig");
var MapLayer = cc.Class({
    extends: cc.Component,
    properties: {
        _className: "MapLayer",
    },

    onLoad: function() {
        this.floorLevel = 0;     //楼层
        this.equipTab = [];     //设备
        this.employTab = [];    //店员
        this.guestTab = [];     //顾客
        this.catTab = [];       //猫咪
        this.aStarMap = this.node.getComponent("AstarMap");

        //地图基本配置
        this.mapEnter = [];     //地图入口
        this.mapExport = [];    //地图出口

        //地图子节点内存池
        this.mapNodePool = {
            "Equipment": [],
            "PlayerCat": [],
            "PlayerEmploy": [],
            "PlayerGuest": []
        };
        cc.log("onload");
    },

    start () {
        cc.log("start");
        //地形设置入口
        for(let i=0; i<this.mapEnter.length; i++){
            let enterPos = this.mapEnter[i];
            let tile = this.aStarMap.getTileByPos(enterPos);
            tile.setSpecialBarrier("enter");
            tile.showDebugDraw();
        }
        //地形设置出口
        for(let i=0; i<this.mapExport.length; i++){
            let exportPos = this.mapExport[i];
            let tile = this.aStarMap.getTileByPos(exportPos);
            tile.setSpecialBarrier("export");
            tile.showDebugDraw();
        }
    },

    //初始化地图
    initMap: function(args, mapManager){
        cc.log("initMap");
        //设置楼层
        this.floorLevel = args.floor;
        this.mapManager = mapManager;
        //初始化设备
        var equips = args.equips || [];
        for(var i=0; i<equips.length; i++){
            this.addEquip(equips[i]);
        }

        //初始化店员
        var employs = args.employs || [];
        for(var i=0; i<employs.length; i++){
            this.addPlayerEmploy(employs[i]);
        }

        //初始化顾客
        var guests = args.guests || [];
        for(var i=0; i<guests.length; i++){
            guests[i].moveSpeed = Util.getRandom(100, 180);
            this.addPlayerGuest(guests[i]);
        }

        //初始化猫咪
        var cats = args.cats || [];
        for(var i=0; i<cats.length; i++){
            this.addPlayerCat(cats[i]);
        }
    },

    //增加设备
    addEquip: function (args) {
        let equipName = "Equipment";
        let equipNode;
        if(!this.mapNodePool[equipName] || this.mapNodePool[equipName].length < 1){
            let prefab = cc.loader.getRes(EquipmentConfig.PREFAB[args.type], cc.Prefab);
            equipNode = cc.instantiate(prefab);
            equipNode.parent = this.node;
        }else {
            equipNode = this.mapNodePool[equipName].pop();
            equipNode.active = true;
        }
        let equipment = equipNode.getComponent(equipName);
        equipment.initEquip(args);
        this.equipTab.push(equipNode);
    },
    //移除设备
    removeEquip: function(node){
        let equipName = "Equipment";
        for(let i=0; i<this.equipTab.length; i++){
            if(node === this.equipTab[i]){
                this.equipTab.splice(i, 1);
                break;
            }
        }
        node.active = false;
        this.mapNodePool[equipName].push(node);
    },

    //增加店员
    addPlayerEmploy: function (args) {
        console.log(this.mapNodePool);
        let employName = "PlayerEmploy";
        let employNode;
        if(!this.mapNodePool[employName] || this.mapNodePool[employName].length < 1){
            let prefab = cc.loader.getRes(GameRes.prefabPlayerEmploy, cc.Prefab);
            employNode = cc.instantiate(prefab);
            employNode.parent = this.node;
        }else {
            employNode = this.mapNodePool[employName].pop();
            employNode.active = true;
        }
        let equipment = employNode.getComponent(employName);
        equipment.initPlayer(args);
        this.employTab.push(employNode);
    },

    //移除店员
    removePlayerEmploy: function(node){
        let employName = "PlayerEmploy";
        for(let i=0; i<this.employTab.length; i++){
            if(node === this.employTab[i]){
                this.employTab.splice(i, 1);
                break;
            }
        }
        var playerEmploy = node.getComponent(employName);
        playerEmploy.remove();
        this.mapNodePool[employName].push(node);
    },

    //增加猫咪
    addPlayerCat: function(args){
        var catName = "PlayerCat";
        var catNode;
        if(!this.mapNodePool[catName] || this.mapNodePool[catName].length < 1){
            var prefab = cc.loader.getRes(GameRes.prefabPlayerCat, cc.Prefab);
            catNode = cc.instantiate(prefab);
            catNode.parent = this.node;
        }else {
            catNode = this.mapNodePool[catName].pop();
            catNode.active = true;
        }
        var playerCat = catNode.getComponent(catName);
        playerCat.initPlayer(args);
        this.catTab.push(catNode);
    },

    //移除猫咪
    removePlayerCat: function(node){
        let catName = "PlayerCat";
        for(let i=0; i<this.catTab.length; i++){
            if(node === this.catTab[i]){
                this.catTab.splice(i, 1);
                break;
            }
        }
        let playerCat = node.getComponent(catName);
        playerCat.remove();
        this.mapNodePool[catName].push(node);
        //cc.log("当前猫咪数量:"+this.catTab.length + "内存池:"+this.mapNodePool[catName].length);
    },

    //增加顾客
    addPlayerGuest: function(args){
        cc.log("增加顾客");
        var guestName = "PlayerGuest";
        var guestNode;
        if(!this.mapNodePool[guestName] || this.mapNodePool[guestName].length < 1){
            var prefab = cc.loader.getRes(GameRes.prefabPlayerGuest, cc.Prefab);
            guestNode = cc.instantiate(prefab);
            guestNode.parent = this.node;
        }else {
            guestNode = this.mapNodePool[guestName].pop();
            guestNode.active = true;
        }
        var playerGuest = guestNode.getComponent(guestName);
        playerGuest.initPlayer(args);
        this.guestTab.push(guestNode);
    },

    //移除顾客
    removePlayerGuest: function(node){
        let guestName = "PlayerGuest";
        for(let i=0; i<this.guestTab.length; i++){
            if(node === this.guestTab[i]){
                this.guestTab.splice(i, 1);
                break;
            }
        }
        let playerGuest = node.getComponent(guestName);
        playerGuest.remove();
        this.mapNodePool[guestName].push(node);
    },

    //检查所有设备是否可用: 检查设备是否可用之前要先寻路一次,对瓦片进行标记
    checkEquipsUsefull: function () {
        //以入口为原点寻路到出口, 遍历所有的瓦片
        var enterPos = this.mapEnter[0];
        var exportPos = this.mapExport[0];
        this.aStarMap.getMovePathTiles(enterPos, exportPos, false);
        //console.log(this.aStarMap._astarGroup);

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
        for(let i=0; i<this.mapExport.length; i++){
            var exportPos = this.mapExport[i];
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
            if(tile && !tile.last){
                cc.log("猫咪不可抵达出入口");
                return false;
            }
        }
        return true;
    },

    //获取当前楼层
    getCurFloorLevel: function(){
        return this.floorLevel;
    },

    //获取最大楼层,第一层是街道不算
    getMaxFloorLevel: function(){
        var floors = this.mapManager.getComponent("ShopManager").getFloors();
        return floors.length - 1;
    },

    //获取楼层设备
    getFloorEquips: function(){
        return this.equipTab;
    },
    
    //地图入口
    getMapEnter: function () {
        let index = Util.getRandom(0, this.mapEnter.length-1);
        return this.mapEnter[index];
    },
    
    //地图出口
    getMapExport: function () {
        let index = Util.getRandom(0, this.mapExport.length-1);
        return this.mapExport[index];
    },
    
    //营业厅入口
    getShopEnter: function () {
        //有需要的类实现
    }
});
module.export = MapLayer;
