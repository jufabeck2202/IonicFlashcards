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
.controller('AddCardsCtrl',function($scope,$state,$ionicHistory) {
  //function to go to the next view without a back button -> nice  approach :D
  $scope.closeDeck=function(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go("app.courses");

  }
  

  
})
.controller('CardQueryCtrl',function($scope,$stateParams,$ionicPopover,DeckService){ 
  $scope.deck= DeckService.getByName($stateParams.cardQuery);
  $scope.currentCard=1;//current card
  $scope.cardCount=$scope.deck.words.length;//counts of the cards in the Deck
  $scope.displayWord=$scope.deck.words[$scope.currentCard-1].frontside;
  $scope.done=false;

  var currentSide="frontside";
  $scope.onSwitch=function(){ //funktion when to turn the card
    if(!$scope.done){
      if(currentSide=="frontside"){
        currentSide="backside";
        $scope.displayWord=$scope.deck.words[$scope.currentCard-1].backside;
        if($scope.currentCard==$scope.cardCount){
          $scope.done=true;
        }
      }else{
        currentSide="frontside";
        $scope.currentCard++;
        $scope.displayWord=$scope.deck.words[$scope.currentCard-1].frontside;
      }
    }

  };
  //popover
   $ionicPopover.fromTemplateUrl('/templates/queryPopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });


  
});

