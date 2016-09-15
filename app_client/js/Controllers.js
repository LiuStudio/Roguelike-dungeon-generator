angular.module('Dugeon-Generator-App')
	.controller('Home Controller',['$scope','MapGenService', function($scope, MapGenService){
		var map_object;
		var room_number = 0;
		var generateMap = function(){
			MapGenService.map_init();
		    map_object = MapGenService.map_toJSON();	
		}
		

		$scope.room_number = room_number;
		$scope.generateMap = generateMap;
		$scope.map_object = map_object;
		
	}])