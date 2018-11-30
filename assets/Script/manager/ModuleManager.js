/*
* 模块管理器, 管理所有场景模块
* */
var GlobalController = require("GlobalController");
var LoadingController = require("LoadingController");
var MainController = require("MainController");
var GameController = require("GameController");
var ActivityController = require("ActivityController");

var BookViewController = require("BookViewController");
var EmployeeController = require("EmployeeController");
var EquipController = require("EquipController");
var PetController = require("PetController");
var ToolController = require("ToolController");

var ModuleManager = cc.Class({
    properties: {
        _className: "ModuleManager",
    },

    ctor: function() {
        this.init();
    },

    init: function(args) {
        var self = this;

        self._modules = {};

        //全局视图
        var global = new GlobalController();
        self._modules.global = global;

        //进游戏加载界面
        var loading = new LoadingController();
        self._modules.loading = loading;
        
        //主界面大厅
        var main = new MainController();
        self._modules.main = main;

        //游戏界面
        var game = new GameController();
        self._modules.game = game;

        //活动界面
        var activity = new ActivityController();
        self._modules.activity = activity;

        //图鉴界面
        var book = new BookViewController();
        self._modules.book = book;

        //员工界面
        var employee = new EmployeeController();
        self._modules.employee = employee;

        //设备界面
        var equip = new EquipController();
        self._modules.equip = equip;

        //宠物界面
        var pet = new PetController();
        self._modules.pet = pet;

        //道具界面
        var tool = new ToolController();
        self._modules.tool = tool;
	},

    clean: function (args) {
        var self = this;

        for (var i in self._modules) {
            var mo = self._modules[i];
            mo.remove();
        }
    },

    get: function (name) {
        var self = this;

        return self._modules[name];
    },

    removeExistView: function () {
        var self = this;

        self.removeOtherView();

        self.get("login").remove();
    },

    removeOtherView: function() {
        var self = this;

        for (var k in self._modules) {
            var v = self._modules[k];
            if (k === "global" || k === "login" ){
            }else{
                self.get(k).remove();
            }
        }
    }

});

module.exports = ModuleManager;