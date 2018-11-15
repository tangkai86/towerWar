var AstarTile = require("AstarTile");
var AstarMoveType = require('AstarMoveType');
var Astar = cc.Class({
    properties: {
        _moveType: {
            default: null,
            type: AstarMoveType
        },

        _astarGroup:[]  //AstarTile二维数组
    },

    ctor: function () {
        if (arguments.length > 0) {
            this._astarGroup = arguments[0];
        }

        if (arguments.length > 1) {
            this._moveType = arguments[1];
        }
    },

    onLoad: function () {
        this._open = [];
        this._closed = [];
    },
    
    _indexOfTileArray: function(tile, TileArray) {
        for (let i = 0; i < TileArray.length; ++i) {
            if (tile.equalTo(TileArray[i])) {
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
        this.clearAstar();
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
            
            let borderTiles = this._borderMovableTile(currentTile.position);
            //cc.log("查找方向:"+borderTiles);
            for (let i = 0; i < borderTiles.length; ++i) {
                let tile = borderTiles[i];
                if (this._indexOfTileArray(tile, this._closed) != -1) {
                    borderTiles.splice(i, 1);
                    i--;
                    continue;
                }

                //zero: 改变查找权重
                let moveCost = this._costToMove(tile.position, currentTile.position);
                let index = this._indexOfTileArray(tile, this._open);
                
                if (index == -1) {
                	tile.last = currentTile;
                    tile.weight = currentTile.weight + moveCost;
                    let distancePoint = tile.position.sub(finish);
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
        if (this._moveType == AstarMoveType.EIGHT_DIRECTION) {
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

    _borderMovableTile: function(pos) {
        var results = [];
        let hasTop = false;
        let hasBottom = false;
        let hasLeft = false;
        let hasRight = false;
        let x = pos.x;
        let y = pos.y;
        
        // top
        if (this.isCanCross(x, y+1)) {
            results.push(this._astarGroup[x][y+1]);
            hasTop = true;
        }
        // bottom
        if (this.isCanCross(x, y-1)) {
            results.push(this._astarGroup[x][y-1]);
            hasBottom = true;
        }
        // left
        if (this.isCanCross(x-1, y)) {
            results.push(this._astarGroup[x-1][y]);
            hasLeft = true;
        }
        // right
        if (this.isCanCross(x+1, y)) {
            results.push(this._astarGroup[x+1][y]);
            hasRight = true;
        }
        
        if (this._moveType == AstarMoveType.EIGHT_DIRECTION) {
            // Top Left
            if (hasTop && hasLeft) {
                if (this.isCanCross(x-1, y+1)) {
                    results.push(this._astarGroup[x-1][y+1]);
                }
            }
            // Top Right
            if (hasTop && hasRight) {
                if (this.isCanCross(x+1, y+1)) {
                    results.push(this._astarGroup[x+1][y+1]);
                }
            }
            // Bottom Left
            if (hasBottom && hasLeft) {
                if (this.isCanCross(x-1, y-1)) {
                    results.push(this._astarGroup[x+1][y+1]);
                }
            }
            // Bottom Right
            if (hasBottom && hasRight) {
                if (this.isCanCross(x+1, y-1)) {
                    results.push(this._astarGroup[x+1][y-1]);
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
    isCanCross: function(x, y) {
    	if(this._astarGroup[x] && this._astarGroup[x][y]){
    		var astarTile = this._astarGroup[x][y];
        	return astarTile.isCanCross();
    	}
        return false;
    },
});

module.exports = Astar;
