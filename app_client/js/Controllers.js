angular.module('Dungeon-Generator-App')
	.controller('HomeController',['$scope','MapGenService', function($scope, MapGenService){
		var map_object;
		
		$scope.numberroom = '';
		var generateMap = function(){
			MapGenService.map_init();
		    $scope.map_object = MapGenService.map_toJSON();	
		}
		

		$scope.generateMap = generateMap;
		
		$scope.testobj = {
			rows: [{data: [1,2,3]},
					{data:[4,5,6]},
					{data:[7,8,9]}	]
		};

	}])
	
	.controller('NavController', ['$scope', function($scope){
			console.log('Running NavController');
		}])

		
	.controller('AboutUsController', ['$scope', function($scope){
			console.log('Running AboutusController');
		}])
