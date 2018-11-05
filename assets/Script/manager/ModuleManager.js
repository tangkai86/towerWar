/*
* 模块管理器, 管理所有场景模块
* */
var GlobalController = require("GlobalController");
var MainController = require("MainController");
var ActivityController = require("ActivityController");
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

        var global = new GlobalController();
        self._modules.global = global;
        
        var main = new MainController();
        self._modules.main = main;

        var activity = new ActivityController();
        self._modules.activity = activity;
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