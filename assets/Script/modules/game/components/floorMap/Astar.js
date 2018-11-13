var AstarTile = require("AstarTile");
var AStarMoveType = cc.Enum({
    FOUR_DIRECTION: 1,
    EIGHT_DIRECTION: 2
});

var Astar = cc.Class({
    extends: cc.Component,

    properties: {
        moveType: {
            default: AStarMoveType.FOUR_DIRECTION,
            type: AStarMoveType
        },

        _astarGroup:[]  //AstarTile二维数组
    },

    ctor: function () {
        if (arguments.length > 0) {
            this._astarGroup = arguments[0];
        }
    },

    onLoad: function () {
        this._open = [];
        this._closed = [];
    },
    
    _indexOfTileArray: function(value, TileArray) {
        for (let i = 0; i < TileArray.length; ++i) {
            if (value.equals(TileArray[i].position)) {
                return i;
            }
        }
        return -1;
    },
    
    _insertToOpen: function(tile) {
        let tileFar = tile.far;
        let length = this._open.length;
        let i = 0;
        for (; i < length; ++i) {
            if (tileFar <= this._open[i].far) {
                break;
            }
        }
        this._open.splice(i, 0, tile);
    },
    
    moveToward: function(start, finish, findEnd = true) {
    	//清空寻路
        this.clearAstar()
        let paths = [];
        let finishTile = null;
        
        var startTile = this.getTileByPos(start);
        this._open.push(startTile);
        do {
            let currentTile = this._open.shift();
            this._closed.push(currentTile);
            //cc.log("查找tile:"+currentTile.position);
            
            //查找到目标
            if (currentTile.position.equals(finish) && !finishTile) {
                finishTile = currentTile;
                if(findEnd){
                	break;
                }
            }
            
            let borderPositions = this._borderMovablePoints(currentTile.position);
            //cc.log("查找方向:"+borderPositions);
            for (let i = 0; i < borderPositions.length; ++i) {
                let borderPosition = borderPositions[i];
                if (this._indexOfTileArray(borderPosition, this._closed) != -1) {
                    borderPositions.splice(i, 1);
                    i--;
                    continue;
                }
                
                let tile = this.getTileByPos(borderPosition);
                //zero: 改变查找权重
                let moveCost = this._costToMove(borderPosition, currentTile.position)
                let index = this._indexOfTileArray(borderPosition, this._open);
                
                if (index == -1) {
                	tile.last = currentTile;
                    tile.weight = currentTile.weight + moveCost;
                    let distancePoint = borderPosition.sub(finish);
                    tile.distance = Math.abs(distancePoint.x) + Math.abs(distancePoint.y);
                    this._insertToOpen(tile);
                } else {
                    tile = this._open[index];
                    if (currentTile.weight + moveCost < tile.weight) {
                        tile.weight = currentTile.weight + moveCost;
                        this._open.splice(index, 1);
                        this._insertToOpen(tile);
                    }
                }
            }
        } while (this._open.length > 0);

        if(finishTile){
        	let tmpTile = finishTile;
            do {
                paths.unshift(tmpTile);
                tmpTile = tmpTile.last;
            } while (tmpTile !== null);
        }
        return paths;
    },

    //清空寻路信息
    clearAstar: function() {
    	this._open = [];
        this._closed = [];

        //清空每块瓦片的寻路信息
        for(var i=0; i<this._astarGroup.length; i++){
        	for(var j=0; j<this._astarGroup[i].length; j++){
        		var astarTile = this._astarGroup[i][j];
        		astarTile.clearAstar();
        	}
        }
    },
    
    _costToMove(positionLeft, positionRight) {
        if (this.moveType == AStarMoveType.EIGHT_DIRECTION) {
            /**
             * diagonal length: 1.41 ≈ Math.sqrt(x * x + y * y)
             * line length: 1
             * 
             * cost = length * 10
             * diagonal cost = 14 ≈ 14.1
             * cost line = 10 = 1 * 10
             */
            return (positionLeft.x != positionRight.x) && (positionLeft.y != positionRight.y) ? 14 : 10;
        } else {
            return 1;
        }
    },
    
    _borderMovablePoints: function(position) {
        var results = [];
        let hasTop = false;
        let hasBottom = false;
        let hasLeft = false;
        let hasRight = false;
        
        // top
        let top = cc.v2(position.x, position.y + 1);
        if (this.isCanCross(top)) {
            results.push(top);
            hasTop = true;
        }
        // bottom
        let bottom = cc.v2(position.x, position.y - 1);
        if (this.isCanCross(bottom)) {
            results.push(bottom);
            hasBottom = true;
        }
        // left
        let left = cc.v2(position.x - 1, position.y);
        if (this.isCanCross(left)) {
            results.push(left);
            hasLeft = true;
        }
        // right
        let right = cc.v2(position.x + 1, position.y);
        if (this.isCanCross(right)) {
            results.push(right);
            hasRight = true;
        }
        
        if (this.moveType == AStarMoveType.EIGHT_DIRECTION) {
            // Top Left
            let topLeft = cc.v2(position.x - 1, position.y + 1);
            if (hasTop && hasLeft) {
                if (this.isCanCross(topLeft)) {
                    results.push(topLeft);
                }
            }
            // Top Right
            let topRight = cc.v2(position.x + 1, position.y + 1);
            if (hasTop && hasRight) {
                if (this.isCanCross(topRight)) {
                    results.push(topRight);
                }
            }
            // Bottom Left
            let bottomLeft = cc.v2(position.x - 1, position.y - 1);
            if (hasBottom && hasLeft) {
                if (this.isCanCross(bottomLeft)) {
                    results.push(bottomLeft);
                }
            }
            // Bottom Right
            let bottomRight = cc.v2(position.x + 1, position.y - 1);
            if (hasBottom && hasRight) {
                if (this.isCanCross(bottomRight)) {
                    results.push(bottomRight);
                }
            }
        }
        return results;
    },

    //获取地图块
    getTileByPos: function(pos) {
    	return this._astarGroup[pos.x][pos.y];
    },

    //判断地图块是否可以通过
    isCanCross: function(pos) {
    	if(this._astarGroup[pos.x] && this._astarGroup[pos.x][pos.y]){
    		var astarTile = this._astarGroup[pos.x][pos.y];
        	return astarTile.isCanCross();
    	}
        return false;
    },
});

module.exports = Astar;
