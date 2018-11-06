/*

Controller 所有界面控制基类

*/
var Controller = cc.Class({
    properties: {
        _className: "Controller",
        view: null
    },

    ctor: function () {
        this._moduleEvent = [];
        this.initGlobalEvent();
    },

    //全局事件，不销毁
    initGlobalEvent: function () {

    },

    //控制器 事件 ，根据view的消亡而消失
    initModuleEvent: function () {

    },

    removeModuleEvent: function () {

    },

    initView: function () {

    },

    hide: function () {
        this.view.setActive(false);
    },

    remove: function () {
        if (this.view) {
            this.view.destroyNode();
            this.view = null;
            this.clearModuleEvent();
            this.removeModuleEvent();
        }
    },

    load: function(name, iterator, complete) {
        gm.rm.load(name, iterator, complete);
    },

    //#args object: 
    //@name 模块名 from_name从哪个模块过来的
    show: function ( args ) {
        var self = this;
        args = args || {};
        var name = args.name || "";
        cc.log("加载资源:"+name);
        if (name.length > 0 && !gm.rm.isLoadded(name)) {
            self.load(name, null, function() {
                self.show(args);
            });
            return;
        }

        if (!this.view) {
            this.view = this.initView(args);
            this.view.setFromName(args.fromName);
            this._moduleEvent = [];
            this.initModuleEvent();
            if(this.view.enterCoustomFinish)
                this.view.enterCoustomFinish();
        }
        else {
            this.view.setActive(true);
        }

        if(args.showCb){
            args.showCb();
        }
    },

    getView: function() {
        return this.view;
    },

    addModuleEvent: function(eventName, cb, unique) {
        var index = gm.event.addEvent(eventName, cb, unique);
        this._moduleEvent.push(index);
    },

    clearModuleEvent: function() {
        for (var i = 0; i < this._moduleEvent.length; i++) {
            var index = this._moduleEvent[i];
            if (index) {
                gm.event.removeEvent(null, index);
            }
        }
    }
});

module.exports = Controller;