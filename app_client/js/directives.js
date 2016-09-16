angular.module('Dungeon-Generator-App')
	.directive('floorTile',function(){
		return {
			restrict: 'E',
			templateUrl: 'floor-tile-template.html'
		};
	});