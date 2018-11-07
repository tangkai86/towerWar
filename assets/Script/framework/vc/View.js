/*

View 所有场景基类

*/
var ET = require("Event");
var View = cc.Class({
    extends: cc.Component,

    properties: {
        _className: "View",
        _fromName: null
    },

    ctor:function () {

    },

    //Override
    onLoad: function(){
        this.node.setContentSize(cc.winSize);
    },

    //Override
    start: function () {
        this.initUi();
    },

    //Override
    update: function (dt) {

    },

    //Override
    lateUpdate: function (dt) {
        
    },

    clickEvent: function(event, customEventData) {
        gm.mp.playEffect(GameRes.audioClickBtn);
    },

    //Override
    onEnable: function () {

    },

    //Override
    onDisable: function () {
        // body...
    },

    //Override
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
    },

    destroyNode: function() {
        this.node.destroy();
    }
});

module.exports = View;