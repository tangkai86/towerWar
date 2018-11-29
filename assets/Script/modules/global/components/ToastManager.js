//吐司管理器
var ToastManager = {
    _toastAction: function(paras) {
        var self = this;
        if (self.toastTxtT.length === 0) return;
        for (var i = 0; i < self.toastBG.length; i++) {
            var v = self.toastBG[i];
            var height = v.getContentSize().height;
            v.runAction(cc.moveBy(0.4,cc.p(0, height)));
        }

        var txt = self.toastTxtT[0];
        var delayT =  self.toastBG.length !== 0 ? 0.4 : 0;
        var time = 2.5;

        if (paras && paras.time) {
            time = paras.time;
        }

        var winSize = cc.winSize;
        var pos = cc.p(winSize.width / 2, winSize.height / 2 + 87);
        var minBGWidth = 476;
        var maxBGWidth = winSize.width - winSize.width * 0.02;

        var bgNode = new cc.Node();
        var spr = bgNode.addComponent(cc.Sprite);
        spr.type = cc.Sprite.Type.SLICED;
        spr.spriteFrame = cc.loader.getRes(GameRes.pngGlobalSprite9_2, cc.SpriteFrame);

        var labelNode = new cc.Node();
        labelNode.color = cc.color(240, 240, 240);
        labelNode.parent = bgNode;
        var label = labelNode.addComponent(cc.Label);
        label.font = GameRes.fontNormal;
        label.string = txt;
        label.fontSize = 22;
        var bgWidth = labelNode.getContentSize().width + 50;
        var bgSize = cc.size(bgWidth, 40);
        labelNode.setPosition(bgSize.width/2, bgSize.height/2);
        bgNode.setContentSize(bgSize);

        if (paras && paras.pos) { pos = paras.pos; }
        bgNode.setPosition(pos);
        bgNode.opacity = 0;
        bgNode.parent = self.__instance;
        self.toastBG.push(bgNode);

        bgNode.runAction(cc.sequence(
            cc.delayTime(delayT ? delayT : 0),
            cc.fadeTo(0.5,255),
            cc.callFunc(function() {
                self.toastTxtT.shift();
                self._toastAction(paras);
            }),
            cc.fadeTo(time,0),
            cc.callFunc(function(sender) {
                self.toastBG.shift();
                if (self.toastTxtT.length <= 0) {
                    self.cleanToast();
                }
            })));
    },

    showToast: function(paras) {
        var self = this;

        if (!paras || !paras.txt) {
            return;
        }

        self.toastTxtT = self.toastTxtT ? self.toastTxtT : [];
        self.toastBG = self.toastBG ? self.toastBG : [];

        for (var i = 0; i < self.toastTxtT.length; i++) {
            var v = self.toastTxtT[i];
            if (paras.txt === v) return;
        }

        self.toastTxtT.push(paras.txt);
        if (self.toastTxtT.length !== 1) return;

        if (!self.__instance) {
            self.__instance = new cc.Node();
            GlobalLayer.addChild(self.__instance, 9999999);
        }

        self._toastAction(paras);
    },

    cleanToast: function() {
        var self = this;
        if (self.__instance) {
            self.__instance.removeFromParent();
        }

        self.__instance = null;
        self.toastBG = [];
        self.toastTxtT = [];
    }
};

module.exports = ToastManager;


