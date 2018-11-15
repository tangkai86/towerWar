
/*=======================================
    游戏界面View
    2018/11/12
    Zero
=======================================*/
var RoomsManager = require("RoomsManager");
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

    onLoad: function(){
        this.userEnter();
    },

    //初始化数据
    initData: function () {

    },

    //初始化Ui
    initUi: function () {
        //初始化房间
        var Panel_room = this.node.getChildByName("Panel_room");
        this.roomsManager = Panel_room.addComponent("RoomsManager");
    },

    //玩家进入游戏
    userEnter: function(args){
        var user = {
            floors: [
                {
                    floor: 1,
                    equips: [
                        {level: 10, type: 1, x: 2, y: 2},
                        {level: 15, type: 2, x: 4, y: 4}
                    ]
                },
                {
                    floor: 2,
                    equips: [
                        {level: 10, type: 1, x: 2, y: 2},
                        {level: 15, type: 2, x: 4, y: 4}
                    ]
                }
            ],
            gold: 100
        };

        //初始化楼层
        for(var i=0; i<user.floors.length; i++){
            //this.roomsManager.initRoom(user);
        }
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
        
    },

    start () {

    }
});

module.exports = GameView;