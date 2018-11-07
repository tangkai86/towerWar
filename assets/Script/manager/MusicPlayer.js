var CocosExtend = require("CocosExtend");
var MusicPlayer = cc.Class({
    properties: {
        _className: "MusicPlayer",
    },
	ctor: function() {
		this.init();
	},

	init: function() {
		var self = this;

	},

	resetOnlyOnce: function() {
		this.setMusicVolume(0);
		this.stopMusic();
	},

	//背景淡出
	backgroundSineOut: function() {
		var self = this;
		if (self.sheduler_sinein) {
            self.isSineIn = false;
            UtilAction.stopGlobalAction(self.sheduler_sinein);
			delete self.sheduler_sinein;
		}

		if (self.isSineOut) return;
		self.isSineOut = true;
		var volume = self.getMusicVolume();
		var sineout = function () {
			if (!self.isSineOut || volume <= 0.02) {
				if (volume <= 0.02) {
                    self.stopMusic();
				}
				self.isSineOut = false;
				return;
			}

			volume = volume - 0.05;
			volume = volume < 0 ? 0 : volume;

			self.setMusicVolume(volume);

			self.sheduler_sineout = UtilAction.performWithGlobal(function() {
				delete self.sheduler_sineout;
				sineout();
			}, 0);
		};
		sineout();
	},

	//背景音乐淡入
	backgroundSineIn: function(filepath, isLoop) {
		var self = this;
		if (self.sheduler_sineout) {
            self.isSineOut = false;
            UtilAction.stopGlobalAction(self.sheduler_sineout);
			delete self.sheduler_sineout;
		}

		var volume = 0;
		if (!self.isMusicPlaying()) {
			this.playMusic(filepath, isLoop)
		}
		else {
			volume = self.getMusicVolume();
		}

		if (self.isSineIn) return;
		self.isSineIn = true;

		var sineIn =function () {
			if (!self.isSineIn || volume >= 1) {
				self.setMusicVolume(1);
				self.isSineIn = false;
				return;
			}

			volume = volume + 0.01;
			self.setMusicVolume(volume);

			self.sheduler_sinein = UtilAction.performWithGlobal(function() {
				delete self.sheduler_sinein;
				sineIn();
			}, 0.02);
		};
		sineIn();
	},

	//获取背景音乐音量
    getMusicVolume: function() {
		return cc.audioEngine.getMusicVolume()
	},

	//设置背景音乐音量
    setMusicVolume: function(volume) {
		cc.audioEngine.setMusicVolume(volume);
	},

	//播放背景音乐
    playMusic: function(filePath, isLoop) {
    	var self = this;
        if (self.isMusicPlaying()) return;
        var audioClip = cc.loader.getRes(filePath, cc.AudioClip);
        var loopValue = isLoop || false;
        if(audioClip){
            cc.audioEngine.playMusic(audioClip, loopValue);
        }else {
            cc.loader.loadRes(filePath, cc.AudioClip, function (err, audiClip) {
                self.playMusic(filePath, isLoop);
            });
        }
    },

    //停止播放背景音乐
    stopMusic: function() {
        cc.audioEngine.stopMusic()
    },

    //恢复背景因为
    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    //暂停背景音乐
    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

	//判断是否正在播放背景音乐
    isMusicPlaying: function() {
        return cc.audioEngine.isMusicPlaying();
    },

	playEffect: function(filePath, isLoop) {
        var audioClip = cc.loader.getRes(filePath, cc.AudioClip);
        var loopValue = isLoop || false;
        if(audioClip){
            return cc.audioEngine.playEffect(audioClip, loopValue);
		}else {
            cc.loader.loadRes(filePath, cc.AudioClip);
		}
	},

	stopEffect: function(handle) {
		cc.audioEngine.stopEffect(handle);
	},

	//游戏中调用，暂时静音
	setEffectMute: function(mute) {
		var self = this;
		self.effect_mute = mute;
		if (self.effect_mute) {
			cc.audioEngine.stopAllEffects();
		}
	},

	getEffectsEnabled: function() {
		var self = this;
		return self.pauseGameEffects;
	}
});