
/*=======================================
    游戏界面View
    2018/11/12
    Zero
=======================================*/
var RoomsManager = require("RoomsManager");
var StreetManager = require("StreetManager");
var View = require("View");
var GameView = cc.Class({
    extends: View,
    properties: {
        _className: {
            default: "GameView",
            override: true
        },

        roleNameLable: {
        	default: null,
        	type: cc.Node
        },

        diamondLable: {
        	default: null,
        	type: cc.Node
        },

        goldLable: {
        	default: null,
        	type: cc.Node
        },

        catLable: {
        	default: null,
        	type: cc.Node
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
        var Panel_room = this.node.getChildByName("Panel_room");
        this.roomsManager = Panel_room.addComponent("RoomsManager");

        // 初始化街道
        var Panel_street = this.node.getChildByName("Panel_room");
        var StreetMap = cc.find("Panel_street/StreetMap", this.node)
        StreetMap.addComponent("StreetManager");

        this.viewList = [];
        
        this.viewList["ToolView"] = ET.EVT_OPEN_VIEW_TOOL;
        this.viewList["PetView"] = ET.EVT_OPEN_VIEW_PET;
        this.viewList["EquipView"] = ET.EVT_OPEN_VIEW_EQUIP;
        this.viewList["EmployeeView"] = ET.EVT_OPEN_VIEW_EMPLOYEE;
        this.viewList["BookView"] = ET.EVT_OPEN_VIEW_BOOK;

        // 文本设置
        this.roleNameString = this.roleNameLable.getComponent(cc.Label);
        this.diamondString = this.diamondLable.getComponent(cc.Label);
        this.goldString = this.goldLable.getComponent(cc.Label);
        this.catString = this.catLable.getComponent(cc.Label);
    },

    //玩家进入游戏
    userEnter: function(args){
        cc.log("玩家进入房间");
        var user = {
            floors: [
                {
                    floor: 1,
                    equips: [
                        {level: 10, type: 1, x: 2, y: 2},
                        {level: 15, type: 2, x: 4, y: 4},
                        {level: 15, type: 2, x: 4, y: 4},
                        {level: 15, type: 2, x: 4, y: 4},
                        {level: 15, type: 2, x: 4, y: 4},
                        {level: 15, type: 2, x: 4, y: 4}
                    ],
                    employs: [
                        {level: 10, type: 1, x: 5, y: 5},
                        {level: 15, type: 1, x: 2, y: 2},
                        {level: 20, type: 1, x: 3, y: 3},
                    ],
                    cats: [
                        {level: 10, type: 1, x: 5, y: 5},
                        {level: 10, type: 1, x: 6, y: 6},
                    ]
                }
            ],
            gold: 100
        };

        //初始化楼层
        for(var i=0; i<user.floors.length; i++){
            this.roomsManager.initRoom(user);
        }

        this.flushData()
    },

    flushData: function () {
    	this.roleNameString.string = "大帅哥";
    	this.diamondString.string = 100;
    	this.goldString.string = 300;
    	this.catString.string = 500;
    },

    clickEvent: function(event, customEventData) {
        this._super(event, customEventData);
    },

    clickRoleHead: function(event, customEventData) {
    	cc.log("点击人物头像");
    },

    clickBottomButton: function(event, customEventData) {
    	if (this.viewList[customEventData] == null) {
    		cc.log("viewList 没有定义:", customEventData);
    		return
    	};

    	gm.event.dispatchEvent(this.viewList[customEventData]);
    },
});

module.exports = GameView;