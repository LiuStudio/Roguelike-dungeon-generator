ngular.module('Dungeon-Generator-App')
	.directive('floorTile',function(){
		return {
			restrict: 'A',
			template: '<strong>Hello from directive</strong>'
		}
	});