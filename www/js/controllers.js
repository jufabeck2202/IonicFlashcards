angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
})

.controller('CourseCtrl',function($scope,DeckService) {
  $scope.decks = DeckService.all();

  
})
.controller('CreateDeckCtrl',function($scope,$stateParams) {
  $scope.onSaveDeck = function(){
    
  }

  
})
.controller('AddCardsCtrl',function($scope,$stateParams) {
  console.log($stateParams);
  

  
})
.controller('CardQueryCtrl',function($scope,$stateParams,DeckService) {
  console.log($stateParams);
  $scope.deck= DeckService.getByName($stateParams.cardQuery)
  
});

