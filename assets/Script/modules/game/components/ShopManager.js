
//地图管理器
var ShopManager = cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad: function(){
        this.roomSize = this.node.getContentSize();
        this.floorTab = []; //楼层
        this.guestTab = []; //游客
    },

    start: function(){
        var self = this;
        //商店
        this.Panel_shop = this.node.getChildByName("Panel_shop");
        //滑动层
        this.Content_node = this.Panel_shop.getChildByName("Content_node");
        //房间Panel
        this.Panel_room = this.Content_node.getChildByName("Panel_room");
        //街道Panel
        this.Panel_street = this.Content_node.getChildByName("Panel_street");

        //定时刷新游客
        this.node.runAction(cc.repeatForever(
            cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(function () {
                    self.refreshGuest();
                })
            )
        ));
    },

    initShop: function (args) {
        var shopHeight = 0;
        //初始化街道
        var StreetMapNode = this.Panel_street.getChildByName("StreetMap");
        var streetLayer = StreetMapNode.addComponent("StreetLayer");
        streetLayer.initMap(args.floors[0], this.node);
        this.floorTab.push(StreetMapNode);
        shopHeight = shopHeight + this.Panel_street.height;

        //初始化地板
        var floors = args.floors;
        for(var i=1; i<floors.length; i++){
            var floorNode = this.addRoom(floors[i]);
            floorNode.setPosition(cc.v2(-this.roomSize.width/2, -this.roomSize.height/2 + (i-1)*floorNode.getContentSize().height));
            this.floorTab.push(floorNode);
            shopHeight = shopHeight + floorNode.height;
        }
        this.Content_node.height = shopHeight;
    },

    //增加房间
    addRoom: function (args) {
        var prefab = cc.loader.getRes(GameRes.prefabFloor, cc.Prefab);
        var floorNode = cc.instantiate(prefab);
        floorNode.parent = this.Panel_room;
        var floorLayer = floorNode.getComponent("FloorLayer");
        floorLayer.initMap(args, this.node);
        return floorNode;
    },

    //顾客进店
    guestInShop: function (guests) {
        cc.log("新增游客1");
        this.guestTab = this.guestTab.concat(guests);
    },
    
    //刷新游客
    refreshGuest: function () {
        cc.log("新增游客2");
        if(this.guestTab.length > 0){
            let guest = this.guestTab.pop();
            let mapLayer = this.floorTab[0].getComponent("MapLayer");
            let mapEnter = mapLayer.getMapEnter();
            guest.x = mapEnter.x;
            guest.y = mapEnter.y;
            mapLayer.addPlayerGuest(guest);
            cc.log("新增游客3");
        }
    },

    //顾客进入楼层
    guestEnterFloor: function(args){
        cc.log("用户进入楼层:"+args.floor);
        console.log(this.floorTab);
        let mapNode = this.floorTab[args.floor];
        let mapLayer = mapNode.getComponent("MapLayer");
        let floorEnter = mapLayer.getMapEnter();
        let floorExport = mapLayer.getMapExport();
        let guestData = args.playerData;
        //后门进
        if(guestData.enter && guestData.enter == 1){
            guestData.x = floorExport.x;
            guestData.y = floorExport.y;
            //进入街道
            if(args.floor == 0){
                let shopEnter = mapLayer.getShopEnter();
                guestData.x = shopEnter.x;
                guestData.y = shopEnter.y;
            }
        }else {
            //前门进
            guestData.x = floorEnter.x;
            guestData.y = floorEnter.y;
        }
        mapLayer.addPlayerGuest(guestData);
    },
    
    //获取所有楼层
    getFloors: function () {
        return this.floorTab;
    }
});

module.exports = ShopManager;
