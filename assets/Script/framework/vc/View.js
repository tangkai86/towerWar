/*

View 所有场景基类

*/
var View = cc.Class({
    extends: cc.Component,

    properties: {
        _className: "View";
        _fromName: null;
    },

    ctor:function () {
        
    },

    onLoad: function () {
        
    },

    start: function () {
    
    },

    update: function (dt) {

    },

    lateUpdate: function (dt) {
        
    },

    onEnable: function () {

    },

    onDisable: function () {
        // body...
    },

    onDestroy: function () {
        
    },

    enterCoustomFinish: function () {

    },

    setActive: function(active) {
        this.node.active = active;
    },

    getActive: function(){
        return this.node.active
    },

    setFromName: function(fromName) {
        this._fromName = fromName;
    },

    getFromName: function() {
        return this._fromName;
    }

    remove: function(argument) {
        this.node.destroy();
    }
});