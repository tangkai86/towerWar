var Player = cc.Class({
    extends: cc.Component,
    properties: {
        _className: {
            default: "Player",
            override: true
        },
        level:  1,          //等级
        moveSpeed: {       //移动速度
            default: 200,
            type: cc.Integer
        },
    },

    start () {
        this.autoWalk();
    },

    update: function(dt){
        this.node.zIndex = 2000 - this.node.position.y;
    },

    initPlayer: function (args) {
        this.aStarMap = this.node.parent.getComponent("AstarMap");

        //player位置
        var playerPosition = this.aStarMap.getCenterByTilePos(cc.v2(args.x, args.y));
        this.node.setPosition(playerPosition);
        var tile = this.aStarMap.getTileByPos(cc.v2(args.x, args.y));
        tile.addPeople(this.node);
    },

    //自由移动
    autoWalk: function () {
        var self = this;
        var tileX = Math.floor(Math.random()*this.aStarMap.horTiles);
        var tileY = Math.floor(Math.random()*this.aStarMap.verTiles);
        this.moveToTile(cc.v2(tileX, tileY), function () {
            setTimeout(function () {
                self.autoWalk();
            }, 1000);
        })
    },

    //移动到瓦片
    moveToTile: function(finish, moveCb) {
        let self = this;
        self.node.stopAllActions();
        let start = self.aStarMap.getTilePosByPosition(self.node.position);
        let movePathTiles = self.aStarMap.getMovePathTiles(start, finish);

        //无路可走
        if (movePathTiles.length <= 1) {
            cc.log('cannot find path');
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

    //获取移动时间
    getMoveTime: function (startPos, endPos) {
        let distance = startPos.sub(endPos);
        let time = Math.sqrt(distance.x*distance.x + distance.y*distance.y)/this.moveSpeed;
        return time;
    }
});

module.exports = Player;
