

var ModuleManager = cc.Class({
    properties: {
        _className: "ModuleManager",
    },

    ctor: function() {
        var self = this;
    },

    init: function(args) {
        var self = this;

        self._modules = {};

        var gview = new GlobalController();
        self._modules.global = gview;
        
        var main = new MainController();
        self._modules.main = main;

        var fightGame = new FightGameController();
        self._modules.fightGame = fightGame;
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