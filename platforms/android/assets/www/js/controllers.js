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

.controller('CourseInfoCtrl',function($scope,DeckService,$stateParams,$cordovaSQLite) {
  $scope.deck= DeckService.getByName($stateParams.deckName);
  $scope.learnedCount = DeckService.getLearnedCount($scope.deck.name);

  $scope.getDeck=function(){
    var query = "SELECT name FROM my_db.sqlite_master WHERE type='table'";
  
  };
  $scope.getDeck();
  //set the right icon
  $scope.getIcon=function(know){
    if(know==false){
      return "ion-android-radio-button-off";
    }else{
      return "ion-android-checkmark-circle balanced";
    }
  };
  
  
})
.controller('CreateDeckCtrl',function($scope,$stateParams,DeckService) {
  
  //creates empty deck with the right name and stores it in the DeckService
  $scope.onSaveDeck = function(){
    var deck={
      name:this.DeckName,
      words: new Array()//creates empty array template

    }
    DeckService.add(deck);

  }

  
})
.controller('AddCardsCtrl',function($scope,$state,$ionicHistory,$stateParams,DeckService) {
  //function to go to the next view without a back button -> nice  approach :D
  $scope.deckName=$stateParams.addCards
  $scope.closeDeck=function(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go("app.courses");
  }

  
  //
  $scope.currentDeck=DeckService.getByName($scope.deckName);

  $scope.addCard=function() {
    if(this.frontside!=null&&this.backside!=null){
      var word={
        frontside:this.frontside.text,
        backside:this.backside.text,
        know:false
      };
      $scope.currentDeck.words.push(word);
      console.log($scope.currentDeck);
      DeckService.update($scope.deckName,$scope.currentDeck);
      this.frontside.text=null;                
      this.backside.text=null;
      this.frontside=null;                
      this.backside=null;
    }
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
  //popover functions for shuffle switch edit and delete
  $scope.shuffleCards=function() {
    $scope.popover.hide();
  }
  $scope.switchCards=function() {
    $scope.popover.hide();
  }
  $scope.editCard=function() {
    $scope.popover.hide();
  }
  $scope.deleteCard=function() {
    $scope.popover.hide();
  }  

  //normal popover function, called to close and hide the popover.
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

