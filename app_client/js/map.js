angular.module('Dungeon-Generator-App')
	.service('MapGenService',function(){
		const MAP_X = 30;
		const MAP_Y = 30;
		const ROOM_SIZE_MAX = 8;
		const ROOM_SIZE_MIN = 3;
		const PIX_SIZE = 5;
		var floor_map = [];
		var rooms = [];
		var paths= [];
		//x and y are zero based, align with array index
		var Tile = function Tile(x,y){
			this.floorType = 0; //0 -- floor, 1--room , 2--pathway, 3--entrance , 4--Map Entrance, 5--Map Exit
			this.connected = 0; // at the end, any tile which is not floor, should be connected
			this.X = x;
			this.Y = y;
		    this._id = y*MAP_X+x;
		    this.inRoomNumber = 0;
		    this.inPathNumber = 0;
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

			if (y==MAP_Y-1){
				this.Bottom = null;
			}else{
				this.Bottom = this._id+MAP_X;
			}

			if (x == MAP_X-1){
				this.Right = null;
			}else{
				this.Right = this._id+1;
			}

		}

	    Tile.prototype.isConnected = function() {
			return this.connected == 1;
		};
		Tile.prototype.isFloor = function() {
			return (this.floorType == 0);
		};


		Tile.prototype.isMapEntrance = function() {
			return (this.floorType == 4);
		};

		Tile.prototype.isMapExit = function() {
			return (this.floorType == 5);
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

		Tile.prototype.toMapEntrance = function() {
			this.floorType = 4;
		};

		Tile.prototype.toMapExit = function() {
			this.floorType = 5;
		};

		Tile.prototype.toFloor = function() {
			this.floorType = 0;
			this.connected = 0;
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

		Tile.prototype.isLeftBorder = function() {
			
			return (this.isBorder() && this.Left==null);
			
		};

		Tile.prototype.isRightBorder = function() {
			return (this.isBorder() && this.Right==null);
			
		};

		Tile.prototype.isTopBorder = function() {
			return (this.isBorder() && this.Top==null);
			
		};

		Tile.prototype.isBottomBorder = function() {
			return (this.isBorder() && this.Bottom==null);
			
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

		Tile.prototype.isbetweenPathandRoom = function() {
			var result = 0;
			if (this.isFloor() &&( (this.getTop() != null) && (this.getBottom() != null) && (this.getTop().isRoom() && this.getBottom().isPath() && !this.getTop().isConnected()) 
							    || (this.getTop() != null) && (this.getBottom() != null) && (this.getTop().isPath() && this.getBottom().isRoom() && !this.getBottom().isConnected())
							    || (this.getLeft() != null) && (this.getRight() != null) && (this.getLeft().isRoom() && this.getRight().isPath() && !this.getLeft().isConnected()) 
							    || (this.getLeft() != null) && (this.getRight() != null) && (this.getLeft().isPath() && this.getRight().isRoom() && !this.getRight().isConnected())
							    )
				){
				result = 1;
			}
			return result;
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
		Tile.prototype.isConnectedRoom = function() {
		//	console.log(this.connected && this.isRoom());
			return (this.connected && this.isRoom());
		};

		Tile.prototype.isConnectedPath = function() {
			return (this.connected && this.isPath());
		};
		
		Tile.prototype.isunConnectedRoom = function() {
			return (this.isRoom() && !this.connected);
		};

		Tile.prototype.isunConnectedPath = function() {
			return (this.isPath() && !this.connected);
		};
		
		Tile.prototype.isFreeNode = function() {
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
		       return (floorNeighbor ==3);	
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
			       return (floorNeighbor ==2);
		       }else{//Not border or corner
				floorNeighbor= this.getTop().isFloor() + this.getBottom().isFloor() + this.getLeft().isFloor()+ this.getRight().isFloor();	 
			 	return (floorNeighbor ==4);
				}
			}	
		}; 

		Tile.prototype.possibleDirections = function() {
			var possibleDirections=[];
			var toptile = this.getTop();
			var bottomtile = this.getBottom();
			var lefttile = this.getLeft();
			var righttile = this.getRight();
		/*	console.log("In possibleDirections function");
			console.log(JSON.stringify(toptile));
			console.log(JSON.stringify(bottomtile));
	        console.log(JSON.stringify(lefttile));
			console.log(JSON.stringify(righttile));
	    */
			if(toptile!= null && toptile.isDeadEnd() && toptile.isFloor()){
				possibleDirections.push('T');
			}
			if(bottomtile!= null && bottomtile.isDeadEnd() && bottomtile.isFloor()){
				possibleDirections.push('B');
			}
			if(lefttile!= null && lefttile.isDeadEnd() && lefttile.isFloor()){
				possibleDirections.push('L');
			}
			if(righttile!= null && righttile.isDeadEnd() && righttile.isFloor()){
				possibleDirections.push('R');
			}

			return possibleDirections;
		};

		var map_init = function(){
			floor_map = [];
			rooms = [];
			paths=[];
			for (var j = 0; j<MAP_Y; j++){	
				for (var i=0; i<MAP_X; i++){
					var tile = new Tile(i,j);
					floor_map.push(tile);
				}	
			}
		//	console.log(JSON.stringify(floor_map));

			
		}

		var map_toJSON = function(){
			var map_object = {};
			map_object.rows=[];
			for (var i=0; i<MAP_Y; i++){
				var row = floor_map.slice(i*MAP_Y,(i+1)*MAP_Y);
				map_object.rows.push({"data":row});
			}
		//	console.info((map_object));
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
			 	var this_room = this;
			 	return rooms.every(function(other_room,index,rooms){
 						return this_room.leftB > other_room.rightB+3 || this_room.rightB < other_room.leftB-3 || this_room.topB > other_room.bottomB+3 || this_room.bottomB < other_room.topB-3 ;
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

		var generateRooms = function(number_of_rooms){
			for (var i = 0; i<number_of_rooms; i++){
				var attempt =0;
				var room_place_success = 0;

				while(attempt < 20){
					attempt ++;
					var width  = Math.floor(Math.random()*(ROOM_SIZE_MAX-ROOM_SIZE_MIN)+ROOM_SIZE_MIN);
					var length = Math.floor(Math.random()*(ROOM_SIZE_MAX-ROOM_SIZE_MIN)+ROOM_SIZE_MIN);
			        if (width %2 ==0){
			        	width--;
			        }
			        if (length %2 ==0){
			        	length--;
			        }

			        var min_x = Math.ceil(width/2)+1;
			        var max_x = MAP_X-Math.ceil(width/2)-1;

			        var min_y = Math.ceil(length/2)+1;
			        var max_y = MAP_Y-Math.ceil(length/2)-1;

					var x = Math.floor(Math.random()*(max_x-min_x))+min_x;
					var y = Math.floor(Math.random()*(max_y-min_y))+min_y;
				//    console.log("attempt = "+attempt+" x, y, width, length is "+x+", "+y+", "+width+" ,"+length);
					var room = new Room(x,y,width,length);
				//	  console.log(JSON.stringify(room));

					if (room.isNotOverlap()){
				//		console.log("isnotoverlap is true");
						room.placeRoom();
						room_place_success = 1;
						break;
					}
					
				}//while 
				
				if (room_place_success == 0) {
					//cannot place room within 20 attemps, may indicate it is not possible to place a room/ or too hard to do it
					break;
				}
			}//for loop
		};


		var Path = function Path(){
			//empty path
				this.connected = 0;
				this.tiles = [];	
		};

		Path.prototype.connectTiles = function() {
			for (var i=0; i<this.tiles.length; i++){
				floor_map[this.tiles[i]].connect();
			}	
		};

		Path.prototype.Connect = function() {
			this.connected == 1;
			this.connectTiles();
		};
		Path.prototype.hasDeadEnd = function() {
			var deadEndTile = this.tiles.find(function(x){
				return (floor_map[x].isDeadEnd());
			});
			return (deadEndTile != null);
		};
		Path.prototype.generatePath = function() {
			var tilestack = [];
			var cur_tile;
			//find first deadend node to start path
			var start_node = null;
			start_node = floor_map.find(function(x){
				return (x.isFloor() && x.isFreeNode());
			});

			if (start_node != null){
				start_node.toPath();
			//	console.log("start_node now is"+JSON.stringify(start_node));
				this.tiles.push(start_node._id);
				tilestack.push(start_node);
				var next_tile;

				while(tilestack[0]){
			//		console.log("tilestack size now is"+tilestack.length);
					cur_tile = tilestack[tilestack.length-1];
	        //       console.log("cur_tile is "+JSON.stringify(cur_tile));	
					//get the last tile, seek whether there is valid location to extend path
					var growOptions = cur_tile.possibleDirections();
			//		console.log("grow options are"+growOptions);
					if (growOptions.length == 0){
					// if no grow option, pop tile, go back to previous tile
						tilestack.pop();
						continue;
					}else{
			//			console.log("Looking for next direction");
					// pick random from available options
						var next_dir_idx = Math.floor(Math.random()*(growOptions.length));	
						var next_dir = growOptions[next_dir_idx];

			//			console.log("next_dir_idx is "+ next_dir_idx);
			//			console.log("next_dir is "+ next_dir);
						
						switch(next_dir){
							case 'T':
								next_tile = cur_tile.getTop();
								break;
							case 'B':
								next_tile = cur_tile.getBottom();
								break;
							case 'L':
								next_tile = cur_tile.getLeft();
								break;
							case 'R':
								next_tile = cur_tile.getRight();
								break;			
						}

						next_tile.toPath();
						next_tile.inPathNumber = paths.length;
						this.tiles.push(next_tile._id);
						tilestack.push(next_tile);
					//	console.log("next_tile is "+JSON.stringify(next_tile));
						continue;
					}
				}
			//	console.log("Hey, i am getting out of the loop");
			}//(if start_node!=null)
			
			paths.push(this);	
		//	console.log("Hey, i am putting in a new path to my paths array");	

		};

		var existFreeNode = function(){
			var freeNode;
			freeNode = floor_map.find(function(x){
				    return (x.isFloor() && x.isFreeNode());
				});
			return freeNode != null;
		};

		var generateAllPaths = function(){
			while (existFreeNode()){
		//		console.log("find one free node");
				var path = new Path();
				path.generatePath();	
			}
		//	console.log("paths size is "+paths.length);
		};

		var findEntrance = function(){
			return floor_map.find(function(x){
				return (x.isFloor() && x.isbetweenPathandRoom());
			});
		}
		
		Tile.prototype.findRoomOfEntrance = function(){
			if(this.getTop().isRoom()){
				return this.getTop();
			}
			if(this.getBottom().isRoom()){
				return this.getBottom();
			}
			if(this.getLeft().isRoom()){
				return this.getLeft();
			}
			if(this.getRight().isRoom()){
				return this.getRight();
			}
			return null;
		}	


		Tile.prototype.findPathOfEntrance = function(){
			if(this.getTop().isPath()){
				return this.getTop();
			}
			if(this.getBottom().isPath()){
				return this.getBottom();
			}
			if(this.getLeft().isPath()){
				return this.getLeft();
			}
			if(this.getRight().isPath()){
				return this.getRight();
			}
			return null;
		}	

		var connectMaze = function(){
			while(findEntrance()){
				var entrance = findEntrance();
				entrance.toEntrance();
				var roomtile = entrance.findRoomOfEntrance();
			//	console.log("roomtile is "+JSON.stringify(roomtile));
				var roomNumber = roomtile.inRoomNumber;
			//	console.log("roomnumber is "+roomNumber);
			//	console.log("room is "+JSON.stringify(rooms[roomNumber]));
				var thisroom = rooms[roomNumber];
				thisroom.Connect();
				entrance.connect();	
				var pathtile = entrance.findPathOfEntrance();
				if(!pathtile.isConnected()){
			    var pathNumber = pathtile.inPathNumber;
				 paths[pathNumber].Connect();
				}
			}
		}
		
		var removeDeadEnds = function(){
			//console.log("paths size is "+paths.length);

			for (var i = 0; i<paths.length; i++){
			//	console.log("i is "+i);
				var cur_path = paths[i];
				while(cur_path.hasDeadEnd()){
			//		console.log("path tile length is "+cur_path.tiles.length);
					if(cur_path.tiles.length >0){
						for (var j = cur_path.tiles.length-1; j>=0; j--){
			//				console.log("j is "+j);
							var tileidx = cur_path.tiles[j];
			//				console.log("tileidx is "+tileidx);
							if(floor_map[tileidx].isDeadEnd() && floor_map[tileidx].isPath()){
			//					console.log("find dead end, j ="+j);
								floor_map[tileidx].toFloor();
								cur_path.tiles.splice(j,1);
							}
						}
					}
				}
			//	console.log("cur_path doesn't has deadend, path size is"+paths[i].tiles.length);
				if(cur_path.tiles.length == 0){
					paths.splice(i,1);
				}
				 
			}
		};

		var AddEntAndExit = function(){
			var leftbordertile = paths[0].tiles.find(function(x){
				return floor_map[x].isLeftBorder();
			});

			var topbordertile = paths[0].tiles.find(function(x){
				return floor_map[x].isTopBorder();
			});

			var rightbordertile = paths[0].tiles.find(function(x){
				return floor_map[x].isRightBorder();
			});

			var bottombordertile = paths[0].tiles.find(function(x){
				return floor_map[x].isBottomBorder();
			});

		//	console.log("find one left borader cell");
		//	console.log(leftbordertile);
			
			if (leftbordertile != null){
				floor_map[leftbordertile].toMapEntrance();
			}else if(topbordertile != null){
				floor_map[topbordertile].toMapEntrance();
			}

			if (rightbordertile != null){
				floor_map[rightbordertile].toMapExit();
			}else if(bottombordertile != null){
				floor_map[bottombordertile].toMapExit();
			}

		};

		this.floor_map = floor_map;
		this.Tile = Tile;
		this.Room = Room;
		this.map_init = map_init;
		this.map_toJSON = map_toJSON;
		this.generateRooms = generateRooms;
		this.generateAllPaths = generateAllPaths;
		this.connectMaze = connectMaze;
		this.removeDeadEnds = removeDeadEnds;
		this.AddEntAndExit = AddEntAndExit;
})

