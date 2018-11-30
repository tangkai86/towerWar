
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
        streetLayer.initMap(args.floors[0]);
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
        floorLayer.initMap(args);
        return floorNode;
    },

    //游客进店
    guestInShop: function (guests) {
        this.guestTab = this.guestTab.concat(guests);
    },
    
    //刷新游客
    refreshGuest: function () {
        if(this.guestTab.length > 0){
            
        }
    }
});

module.exports = ShopManager;
