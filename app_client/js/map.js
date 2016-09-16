angular.module('Dungeon-Generator-App')
	.service('MapGenService',function(){
		const MAP_X = 40;
		const MAP_Y = 40;
		const PIX_SIZE = 5;
		var floor_map = [];
		var rooms = [];
		//x and y are zero based, align with array index
		var Tile = function Tile(x,y){
			this.floorType = 0; //0 -- floor, 1--room , 2--pathway, 3--entrance
			this.connected = 0; // at the end, any tile which is not floor, should be connected
			this.X = x;
			this.Y = y;
		    this._id = y*MAP_X+x;
		    this.inRoomNumber = 0;
			if (y == 0){
				this.Top = null;
			}else{
				this.Top = this._id-MAP_X;	
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
	
		Tile.prototype.isFloor = function() {
			return (this.floorType == 0);
		};


		Tile.prototype.isRoom = function() {
			return (this.floorType == 1);
		};


		Tile.prototype.isPath = function() {
			return (this.floorType == 2);
		};


		Tile.prototype.isEntrance = function() {
			return (this.floorType == 3);
		};

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

		Tile.prototype.isBorder = function() {
			var num_borders = 0;
			num_borders	= (this.Top == null) + (this.Bottom == null) + (this.Right==null) + (this.Left==null);
			return num_borders ==1;
		};

		Tile.prototype.isCorner = function() {
			var num_borders = 0;
			num_borders	= (this.Top == null) + (this.Bottom == null) + (this.Right==null) + (this.Left==null);
			return num_borders ==2;
		};


		Tile.prototype.getTop = function() {
			if (this.Top != null){
					return floor_map[this.Top];
				}else{
					return null;
				}
		};

		Tile.prototype.getBottom = function() {
			if (this.Bottom != null){
					return floor_map[this.Bottom];
				}else{
					return null;
				}
		};

		Tile.prototype.getLeft = function() {
			if (this.Left != null){
					return floor_map[this.Left];
				}else{
					return null;
				}
		};

		Tile.prototype.getRight = function() {
			if (this.Right != null){
					return floor_map[this.Right];
				}else{
					return null;
				}
		};


		Tile.prototype.isDeadEnd = function() {
			var floorNeighbor = 0;
		    if(this.isBorder()){// if is border
		       if(this.getTop() == null){
		    		floorNeighbor= this.getBottom().isFloor() + this.getLeft().isFloor()+ this.getRight().isFloor();   	
		       }if(this.getBottom() == null){
		    		floorNeighbor= this.getTop().isFloor() + this.getLeft().isFloor()+ this.getRight().isFloor();	    	
		       }if(this.getLeft() == null){
		       	    floorNeighbor= this.getTop().isFloor() + this.getBottom().isFloor() + this.getRight().isFloor();	 
		       }if(this.getRight() == null){
		       	    floorNeighbor= this.getTop().isFloor() + this.getBottom().isFloor() + this.getLeft().isFloor();	 
		       }
		       return (floorNeighbor >=2);	
		    }else{ //if it is corner
		       if(this.isCorner()){
			       	if(this.getTop() == null && this.getLeft() == null){
			    		floorNeighbor= this.getBottom().isFloor() + this.getRight().isFloor();   	
			       }if(this.getBottom() == null && this.getLeft() == null){
			    		floorNeighbor= this.getTop().isFloor() + this.getRight().isFloor();	    	
			       }if(this.getTop() == null && this.getRight()==null){
			       	    floorNeighbor= this.getBottom().isFloor() + this.getLeft().isFloor();	 
			       }if(this.getBottom() == null && this.getRight() == null){
			       	    floorNeighbor= this.getTop().isFloor() + this.getLeft().isFloor();	 
			       }
			       return (floorNeighbor >=1);
		       }else{//Not border or corner
				floorNeighbor= this.getTop().isFloor() + this.getBottom().isFloor() + this.getLeft().isFloor()+ this.getRight().isFloor();	 
			 	return (floorNeighbor >= 3);
				}
			}	
		}; 


		var map_init = function(){

			for (var j = 0; j<MAP_Y; j++){	
				for (var i=0; i<MAP_X; i++){
					var tile = new Tile(i,j);
					floor_map.push(tile);
				}	
			}
			console.log(JSON.stringify(floor_map));
			
		}

		var map_toJSON = function(){
			var map_object = {};
			map_object.rows=[];
			for (var i=0; i<MAP_Y; i++){
				var row = floor_map.slice(i*MAP_Y,(i+1)*MAP_Y);
				map_object.rows.push({"data":row});
			}
			console.info((map_object));
			return map_object;
		}
		var map_print = function(){

		}
			// Room Object constructor
			//Require width and lenght are Odd Number for easy now
		var Room = function Room(x,y,width,length){
			this.centerX =x;
			this.centerY = y;
			this.sizeX = width;
			this.sizeY = length;
			this.leftB = x-Math.floor(width/2);
			this.rightB = x+Math.floor(width/2);
			this.topB = y-Math.floor(length/2);
			this.bottomB = y+Math.floor(length/2);
			this.tiles=[];//should contain all the tile in this room's _id, so that later can be easily populate connected thorugh all rooms
			this.connected = 0;
		}

		Room.prototype.isNotOverlap = function() {
			 if(rooms[0]){
			 	return rooms.every(function(other_room,index,rooms){
			 		return this.leftB > other_room.rightB+3 || this.rightB < other_room.leftB-3 || this.topB > other_room.bottomB+3 || this.bottomB < other_room.topB-3 ;
			 	});
			 }else{
			 	return true;
			 }
		};

		Room.prototype.addTiles = function() {
			for (var y=this.topB; y<this.bottomB+1; y++){
				for (var x = this.leftB; x<this.rightB+1; x++){
					var tile_id = x+y*MAP_X;
					this.tiles.push(tile_id);
				}
			}

		};

		Room.prototype.populateTiles = function() {
			for (var i=0; i<this.tiles.length; i++){
				floor_map[this.tiles[i]].toRoom();
				floor_map[this.tiles[i]].inRoomNumber = rooms.length-1;
			}
		};

		Room.prototype.connectTiles = function() {
			for (var i=0; i<this.tiles.length; i++){
				floor_map[this.tiles[i]].connect();
			}	
		};

		Room.prototype.placeRoom = function() {
		    this.addTiles();
			rooms.push(this);
			this.populateTiles();
		};


		Room.prototype.Connect = function() {
			this.connected == 1;
			this.connectTiles();
		};

		Room.prototype.isConnected = function() {
			return this.connected == 1;
		};


		this.floor_map = floor_map;
		this.Tile = Tile;
		this.Room = Room;
		this.map_init = map_init;
		this.map_toJSON = map_toJSON;

})

