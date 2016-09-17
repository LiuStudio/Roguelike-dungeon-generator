angular.module('Dungeon-Generator-App')
	.controller('HomeController',['$scope','MapGenService', function($scope, MapGenService){
		var map_object;
		
		$scope.numberroom = '';
		var generateMap = function(){
			MapGenService.map_init();
			MapGenService.generateRooms(8);
			MapGenService.generateAllPaths();
			MapGenService.connectMaze();
			
		    MapGenService.removeDeadEnds();
		    MapGenService.AddEntAndExit();
		    $scope.map_object = MapGenService.map_toJSON();	
		}
		

		$scope.generateMap = generateMap;
		
	}])
	
	.controller('NavController', ['$scope', function($scope){
			console.log('Running NavController');
		}])

		
	.controller('AboutUsController', ['$scope', function($scope){
			console.log('Running AboutusController');
		}])
