angular.module('Dugeon-Generator-App')
	.service('MapGenService',function(){
		const MAP_X = 50;
		const MAP_Y = 50;
		const PIX_SIZE = 5;
		var floor_map = [];
		//x and y are zero based, align with array index
		var Tile = function Tile(x,y){
			this.floorType = 0; //0 -- floor, 1--room , 2--pathway, 3--entrance
			this.connected = 0; // at the end, any tile which is not floor, should be connected
			this.X = x;
			this.Y = y;
		    this._id = y*MAP_X+x;
			if (y == 0){
				this.Up = null;
			}else{
				this.Up = this._id-MAP_X;	
			}

			if (x ==0) {
				this.Left = null;
			}else{
				this.Left = this._id-1;
			}

			if (y==MAP_Y){
				this.Bottom = null;
			}else{
				this.Bottom = this._id+MAP_X;
			}

			if (x == MAP_X){
				this.Right = null;
			}else{
				this.Right = this._id+1;
			}

		}
	

		Tile.prototype.toRoom = function() {
			this.floorType = 1;
		};

		Tile.prototype.toPath = function() {
			this.floorType = 2;
		};

		Tile.prototype.toEntrance = function() {
			this.floorType = 3;
		};

		Tile.prototype.toFloor = function() {
			this.floorType = 0;
		};

		Tile.prototype.connect = function() {
			this.connected = 1;
		};


		Tile.prototype.disconnect = function() {
			this.connected = 0;
		};


		var map_init = function(){

			for (var i = 0; i<MAP_X; i++){	
				for (var j=0; j<MAP_Y; j++){
					var tile = new Tile(i,j);
					floor_map.push(tile);
				}	
			}
		}

		var map_toJSON = function(){
			var map_object = {};
			map_object."rows"=[];
			for var (i=0; i<MAP_Y; i++){
				var row = floor_map.slice(i*MAP_Y,(i+1)*MAP_Y);
				map_object."rows".push({"data":row});
			}
			return map_object;
		}
		var map_print = function(){

		}

		this.floor_map = floor_map;
		this.Tile = Tile;
		this.map_init = map_init;
		this.map_toJSON = map_toJSON;

})

