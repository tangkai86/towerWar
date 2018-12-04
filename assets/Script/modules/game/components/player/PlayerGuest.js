//顾客
var Player = require("Player");
var PlayerGuest = cc.Class({
    extends: Player,
    properties: {
        _className: {
            default: "PlayerGuest",
            override: true
        }
    },

    onLoad(){
        this.purpose = "enterShop";
        this.playerData = null;
        this.gotoShopPossible = 50;  //进商店概率
        this.useEquipPossible = 10;  //使用设备概率
        this.specialPossible = 10;   //特殊事件触发概率
    },

    start () {
        this._super();
    },

    initPlayer: function (args) {
        let self = this;
        this.playerData = args;
        this.moveSpeed = args.moveSpeed || this.moveSpeed;
        this.purpose = args.enter && args.enter == 1 ? "outShop" : "enterShop";
        this.aStarMap = this.node.parent.getComponent("AstarMap");
        this.floorLayer = this.node.parent.getComponent("MapLayer");

        //player位置
        let playerPosition;
        let tile;
        //指定位置刷新
        console.log(args);
        if(args.x >= 0 && args.y >= 0){
            tile = this.aStarMap.getTileByPos(cc.v2(args.x, args.y));
            playerPosition = this.aStarMap.getCenterByTilePos(tile.position);
            cc.log("指定位置刷新:"+ args.x + " :"+args.y);
        }else {
            //随机位置刷新
            tile = this.aStarMap.getTileByPos(this.getRandomPos());
            playerPosition = this.aStarMap.getCenterByTilePos(tile.position);
            cc.log("随机位置刷新:" + args.x + " :" + args.y);
        }
        this.node.setPosition(playerPosition);
        tile.addPeople(this.node);

        //执行行为
        setTimeout(function () {
            self.doAction();
        }, 500);
    },

    //获取使用设备
    getEquips: function(){
        let floorEquips = this.floorLayer.getFloorEquips();
        let equips = [];
        //获取随机设备
        for(let i=0; i<floorEquips.length-1; i++){
            if(Util.getRandom(1,100) <= this.useEquipPossible){
                equips.push(floorEquips[i]);
            }
            if(equips.length >=3){
                break;
            }
        }
        return equips;
    },

    //当前场景行为
    doAction: function(){
        let equips = this.getEquips();
        if(equips.length > 0){
            //有可使用的设备
            this.useEquips(equips);
        }else {
            //无可使用设备,查找下一步动作
            this.checkAction();
        }
    },

    //使用设备
    useEquips: function(equips){
        let self = this;
        if(equips.length > 0){
            let equipNode = equips.pop();
            let pos = equipNode.getComponent("Equipment").getEquipUsePos();
            let moveCb = function () {
                //使用当前设备
                //使用下一个设备
                setTimeout(function () {
                    self.useEquips(equips);
                }, 2000)
            };
            this.moveToTile(pos, moveCb);
        }else {
            this.checkAction();
        }
    },

    //下一步动作
    checkAction: function () {
        let curFloorLevel = this.floorLayer.getCurFloorLevel();
        let maxFloorLevel = this.floorLayer.getMaxFloorLevel();
        cc.log("当前楼层:"+curFloorLevel+" 总共楼层:"+maxFloorLevel);
        if(this.purpose === "enterShop"){
            if(curFloorLevel == 0){
                if(Util.getRandom(1,100) <= this.gotoShopPossible){
                    this.enterShop();
                }else {
                    this.outShop();
                }
            }else if(curFloorLevel == maxFloorLevel){
                //返回上一层
                this.purpose = "outShop";
                this.enterPreFloor();
            }else {
                //进入下一层
                this.enterNextFloor();
            }
        }else if(this.purpose === "outShop"){
            if(curFloorLevel == 0){
                //出店
                this.outShop();
            }else {
                //返回上一层
                this.enterPreFloor();
            }
        }
    },

    //进入下一层
    enterNextFloor: function(){
        let self = this;
        let curFloorLevel = this.floorLayer.getCurFloorLevel();
        let outPos = this.floorLayer.getMapExport();
        let moveCb = function () {
            let args = {};
            args.playerData = self.playerData;
            args.playerData.enter = 0;  //前门进
            args.floor = curFloorLevel + 1;
            cc.log("客户进入下一层:"+args.floor);
            setTimeout(function () {
                //移除顾客
                self.floorLayer.removePlayerGuest(self.node);
                //顾客进入下一层
                gm.event.dispatchEvent(ET.EVT_GUEST_ENTER_FLOOR, args);
            }, 500);
        };
        this.moveToTile(outPos, moveCb);
    },

    //返回上一层
    enterPreFloor: function(){
        let self = this;
        let curFloorLevel = this.floorLayer.getCurFloorLevel();
        let enterPos = this.floorLayer.getMapEnter();
        let moveCb = function () {
            let args = {};
            args.playerData = self.playerData;
            args.playerData.enter = 1;  //后门进
            args.floor = curFloorLevel - 1;
            setTimeout(function () {
                //移除顾客
                self.floorLayer.removePlayerGuest(self.node);
                //顾客进入下一层
                gm.event.dispatchEvent(ET.EVT_GUEST_ENTER_FLOOR, args);
            }, 500);
        };
        this.moveToTile(enterPos, moveCb);
    },

    //出店
    outShop: function () {
        cc.log("顾客出店");
        let self = this;
        let outPos = this.floorLayer.getMapExport();
        let moveCb = function () {
            //移除顾客
            self.floorLayer.removePlayerGuest(self.node);
        };
        this.moveToTile(outPos, moveCb);
    },
    
    //进店
    enterShop: function () {
        let self = this;
        let curFloorLevel = this.floorLayer.getCurFloorLevel();
        let enterPos = this.floorLayer.getShopEnter();
        let moveCb = function () {
            let args = {};
            args.playerData = self.playerData;
            args.playerData.enter = 0;  //前门进
            args.floor = curFloorLevel + 1;
            setTimeout(function () {
                //移除顾客
                self.floorLayer.removePlayerGuest(self.node);
                //顾客进入下一层
                gm.event.dispatchEvent(ET.EVT_GUEST_ENTER_FLOOR, args);
            }, 500);
        };
        this.moveToTile(enterPos, moveCb);
    }
});

module.exports = PlayerGuest;