
var Player = cc.Class({
    extends: cc.Component,
    properties: {
        _className: {
            default: "Player",
            override: true
        },
        level:  1,          //等级
        moveSpeed: {       //移动速度
            default: 150,
            type: cc.Integer
        },
    },

    onLoad () {
        this.floorLayer = null; //楼层逻辑管理
        this.aStarMap = null;   //地图寻路管理
    },

    start () {

    },

    update: function(dt){
        this.node.zIndex = 1000 - this.node.position.y;
    },

    initPlayer: function (args) {
        this.aStarMap = this.node.parent.getComponent("AstarMap");
        this.floorLayer = this.node.parent.getComponent("MapLayer");

        //player位置
        let playerPosition = this.aStarMap.getCenterByTilePos(cc.v2(args.x, args.y));
        this.node.setPosition(playerPosition);
        let tile = this.aStarMap.getTileByPos(cc.v2(args.x, args.y));
        tile.addPeople(this.node);

        this.autoWalk();
    },

    //自由移动
    autoWalk: function () {
        var self = this;
        this.moveToTile(self.getRandomPos(), function () {
            setTimeout(function () {
                self.autoWalk();
            }, 1000);
        })
    },

    //获取随机位置
    getRandomPos: function(){
        var tileX = Util.getRandom(0, this.aStarMap.horTiles-1);
        var tileY = Util.getRandom(0, this.aStarMap.verTiles-1);
        var randomPos = cc.v2(tileX,tileY);
        var tile = this.aStarMap.getTileByPos(randomPos);
        if(tile.isCanCross()){
            return randomPos;
        }else {
            return this.getRandomPos();
        }
    },

    //移动到瓦片
    moveToTile: function(finish, moveCb) {
        let self = this;
        self.node.stopAllActions();
        let start = self.aStarMap.getTilePosByPosition(self.node.position);
        let movePathTiles = self.aStarMap.getMovePathTiles(start, finish);

        //无路可走
        if (movePathTiles.length <= 1) {
            if(movePathTiles.length <= 0){
                cc.log('cannot find path:');
            }
            if(moveCb) moveCb();
            return;
        }

        let i=0;
        let tileSize = self.aStarMap.getTileSize();
        let tileHalfWidth = tileSize.width / 2;
        let tileHalfHeight = tileSize.height / 2;
        let moveAction = function () {
            let curTile = movePathTiles[i];
            let nextTile = movePathTiles[i+1];
            i = i + 1;
            if(nextTile && nextTile.isCanCross()){
                let curTilePosition = self.aStarMap.getCenterByTilePos(curTile.position);
                let nextTilePosition = self.aStarMap.getCenterByTilePos(nextTile.position);
                let curTileBorder = curTilePosition.add(nextTilePosition.sub(curTilePosition).divSelf(2.1));
                let moveTime = self.getMoveTime(self.node.position, curTileBorder);
                //更新动画方向
                self.updateFlip(curTile, nextTile);
                self.node.runAction(cc.sequence(
                    cc.moveTo(moveTime, curTileBorder),
                    cc.callFunc(function () {
                        if(nextTile && nextTile.isCanCross()){
                            if(nextTile.getPeople().length > 0 && !movePathTiles[i+1]){
                                let addX = Math.floor(Math.random()*60) - 30;
                                let addY = Math.floor(Math.random()*60) - 30;
                                nextTilePosition.addSelf(cc.v2(addX, addY));
                            }
                            curTile.removePeople(self.node);
                            nextTile.addPeople(self.node);
                            let moveTime = self.getMoveTime(self.node.position, nextTilePosition);
                            self.node.runAction(cc.sequence(
                                cc.moveTo(moveTime, nextTilePosition),
                                cc.callFunc(function () {
                                    moveAction();
                                })
                            ));
                        }else {
                            moveAction();
                        }
                    })
                ));
            }else {
                if(moveCb) moveCb();
            }
        };
        moveAction();
    },

    //更新动画方向
    updateFlip: function(curTile, nextTile){
        if(nextTile.position.x > curTile.position.x){
            this.node.scaleX = 1;
        }else if(nextTile.position.x < curTile.position.x) {
            this.node.scaleX = -1;
        }
    },

    //获取移动时间
    getMoveTime: function (startPos, endPos) {
        let distance = startPos.sub(endPos);
        let time = Math.sqrt(distance.x*distance.x + distance.y*distance.y)/this.moveSpeed;
        return time;
    },
    
    //移除
    remove: function () {
        let tile = this.aStarMap.getTileByPosition(this.node.position);
        tile.removePeople(this.node);
        this.node.active = false;
        this.floorLayer = null;
        this.aStarMap = null;
    }
});

module.exports = Player;
