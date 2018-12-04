
/*=======================================
    游戏界面View
    2018/11/12
    Zero
=======================================*/
var View = require("View");
var GameView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "GameView",
            override: true
        },
    },
    ctor: function () {

    },

    //Override
    start: function () {
        this._super();
        this.userEnter();
    },

    //初始化数据
    initData: function () {

    },

    //初始化Ui
    initUi: function () {
        //初始化房间
        this.shopManager = this.node.addComponent("ShopManager");
    },

    //玩家进入游戏
    userEnter: function(args){
        cc.log("玩家进入房间");
        var user = {
            floors: [
                {
                    floor: 0,
                    guests: [
                        {type: 1, id: 10},
                        {type: 1, id: 11},
                        {type: 1, id: 12}
                    ],
                },
                {
                    floor: 1,
                    equips: [
                        {level: 10, type: 1, x: 1, y: 3},
                        {level: 15, type: 1, x: 1, y: 5},
                        {level: 15, type: 1, x: 6, y: 3},
                        {level: 15, type: 2, x: 5, y: 5},
                        {level: 15, type: 2, x: 6, y: 5}
                    ],
                    employs: [
                        {level: 10, type: 1, x: 0, y: 0},
                        {level: 15, type: 1, x: 0, y: 0},
                        {level: 20, type: 1, x: 0, y: 0},
                    ],
                    cats: [
                        {level: 10, type: 1, x: 6, y: 7},
                        {level: 10, type: 1, x: 6, y: 7},
                    ],
                    guests: [
                        // {type: 1, id: 10},
                        // {type: 1, id: 11},
                        // {type: 1, id: 12}
                    ],
                },
                {
                    floor: 2,
                    equips: [
                        {level: 10, type: 1, x: 1, y: 3},
                        {level: 15, type: 1, x: 1, y: 5},
                        {level: 15, type: 1, x: 6, y: 3},
                        {level: 15, type: 2, x: 5, y: 5},
                        {level: 15, type: 2, x: 6, y: 5}
                    ],
                    employs: [
                        {level: 10, type: 1, x: 0, y: 0},
                        {level: 15, type: 1, x: 0, y: 0},
                        {level: 20, type: 1, x: 0, y: 0},
                    ],
                    cats: [
                        {level: 10, type: 1, x: 6, y: 7},
                        {level: 10, type: 1, x: 6, y: 7},
                    ],
                    guests: [
                        // {type: 1, id: 10},
                        // {type: 1, id: 11},
                        // {type: 1, id: 12}
                    ],
                },
                {
                    floor: 3,
                    equips: [
                        {level: 10, type: 1, x: 1, y: 3},
                        {level: 15, type: 1, x: 1, y: 5},
                        {level: 15, type: 1, x: 6, y: 3},
                        {level: 15, type: 2, x: 5, y: 5},
                        {level: 15, type: 2, x: 6, y: 5}
                    ],
                    employs: [
                        {level: 10, type: 1, x: 0, y: 0},
                        {level: 15, type: 1, x: 0, y: 0},
                        {level: 20, type: 1, x: 0, y: 0},
                    ],
                    cats: [
                        {level: 10, type: 1, x: 6, y: 7},
                        {level: 10, type: 1, x: 6, y: 7},
                    ],
                    guests: [
                        // {type: 1, id: 10},
                        // {type: 1, id: 11},
                        // {type: 1, id: 12}
                    ],
                }
            ],
            gold: 100
        };

        //初始化商店
        this.shopManager.initShop(user);

        //顾客刷新
        this.guestInShop();
    },

    //顾客进店
    guestInShop: function(){
        var self = this;
        let guests = [];
        var num = Util.getRandom(1, 2);
        for(var i=0; i<num; i++){
            var guest = {type: 1, id: 10};
            guests.push(guest);
        }
        this.shopManager.guestInShop(guests);
        setTimeout(function () {
            self.guestInShop();
        }, 2000);
    },

    //顾客进入楼层
    guestEnterFloor: function(args){
        this.shopManager.guestEnterFloor(args);
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        
    }
});

module.exports = GameView;