angular.module('starter.controllers', [])

.directive('ngEnter', function () {

    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

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



.controller('EditCardCtrl',function($scope,DeckService ,$stateParams ,$state) {
  console.log($stateParams);
  $scope.Deckname = $stateParams.deckName;
  $scope.cardFrontside=$stateParams.cardname;
  $scope.deck=DeckService.getDeckByName($scope.Deckname);
  var wordIndex=null;
  var getWord = function() {
    for (var i = 0; i < $scope.deck.words.length; i++) {
      if($scope.deck.words[i].frontside==$scope.cardFrontside){
        wordIndex=i;
        return $scope.deck.words[i];
      };
    };
  }
 var word=getWord();
  $scope.frontside=word.frontside;
  $scope.backside=word.backside;

  //gets called when you edit the word
  $scope.save=function(){
    $scope.deck.words[wordIndex].frontside=this.frontside;
    $scope.deck.words[wordIndex].backside=this.backside;


  }

})



.controller('CourseInfoCtrl',function($scope, $state,DeckService,$stateParams,$cordovaSQLite) {
  $scope.deck= DeckService.getDeckByName($stateParams.deckName);

  $scope.getLearnedCount=function(){
    return DeckService.getLearnedCount($scope.deck.name);
  }

  //set the right icon
  $scope.getIcon=function(know){
    if(know==false){
      return "ion-android-radio-button-off";
    }else{
      return "ion-android-checkmark-circle balanced";
    }
  };

  //deletes the deck
  $scope.deleteDeck=function(){
    if(confirm("please confirm to delete "+$scope.deck.name)){
      DeckService.all().splice(DeckService.getDeckByName($scope.deck.name))
      $state.go("app.courses");
    }
  }

  //resetes all know states
  $scope.refreshDeck=function(){
    for (var i = 0; i < $scope.deck.words.length; i++) {
      $scope.deck.words[i].know=false
    };

  }
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
    //TODO direct directly to the course
  }

  //
  $scope.currentDeck=DeckService.getDeckByName($scope.deckName);

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



.controller('CardQueryCtrl',function($scope,$stateParams,$state,$ionicPopover,DeckService){
  var param = $stateParams.cardQuery.split("-");
  var DeckName = param[0];
  $scope.names=param[0];
  var DeckState= param[1]; //0-> all; 1-> learned; 2-> to learn
  $scope.deck= DeckService.getDeckByName(param[0]);
  $scope.currentCard=1;//current card, be carefull, when to use in array -1!
  $scope.done=false;
  $scope.selectedWords=getSelectedCard();
  $scope.cardCount=$scope.selectedWords.length;
  $scope.displayWord=$scope.selectedWords[$scope.currentCard-1].frontside;

  //function to select the right words, for example learned or to learn
  function getSelectedCard() {
    if(DeckState ==0){
      return $scope.deck.words;
    }else if (DeckState==1) {
      var words=[];
      for (var i = 0; i < $scope.deck.words.length; i++) {
        if ($scope.deck.words[i].know==true) {
          words.push($scope.deck.words[i]);
        }
      }
      return words;
    }else if (DeckState==2) {
      var words=[];
      for (var i = 0; i < $scope.deck.words.length; i++) {
        if ($scope.deck.words[i].know==false) {
          words.push($scope.deck.words[i]);
        }
      }
      return words;
    }
  }

  var currentSide="frontside";
  $scope.onSwitch=function(){ //funktion when to turn the card
    if(!$scope.done){
      if(currentSide=="frontside"){
        currentSide="backside";
        $scope.displayWord=$scope.selectedWords[$scope.currentCard-1].backside;
        if($scope.currentCard==$scope.selectedWords.length){
          $scope.done=true;
        }
      }else{
        currentSide="frontside";
        $scope.currentCard++;
        $scope.displayWord=$scope.selectedWords[$scope.currentCard-1].frontside;
      }
    }
  };
  //gets called when you click the knwo button and changes the state
  $scope.changeKnow= function(){
    var tempcard=$scope.selectedWords[$scope.currentCard-1];
    for (var i = 0; i < $scope.deck.words.length; i++) {
      if($scope.deck.words[i].frontside==tempcard.frontside){
        if($scope.deck.words[i].know==true){
          $scope.deck.words[i].know=false;
        }else {
            $scope.deck.words[i].know=true;
        }
      };
    };
  }
  //popover
   $ionicPopover.fromTemplateUrl('/templates/queryPopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  //popover functions for shuffle switch edit and delete
  $scope.shuffleCards=function() {
    //$scope.popover.hide();
  }
  $scope.switchCards=function() {
    //$scope.popover.hide();
  }
  $scope.editCard=function() {
    //$scope.popover.hide();
  }
  $scope.deleteCard=function() {
    //$scope.popover.hide();
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
