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



.controller('EditCardCtrl',function($ionicHistory,$ionicPopup,$scope,DeckService ,$stateParams ,$state) {
  //TODO change know state
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


  $scope.save=function(){
    $scope.deck.words[wordIndex].frontside=this.frontside;
    $scope.deck.words[wordIndex].backside=this.backside;
  }
  $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete card',
     template: 'Are you sure?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $scope.deck.words.splice(wordIndex,wordIndex+1);
      $ionicHistory.goBack();
     }
   });
 }
})



.controller('CourseInfoCtrl',function($scope,$ionicPopup, $state,DeckService,$stateParams,$cordovaSQLite) {
  //TODO: http://ionicframework.com/docs/api/directive/ionCheckbox/ -> add this to know
  $scope.deck= DeckService.getDeckByName($stateParams.deckName);
  $scope.DeckIndex=DeckService.getDeckIndex($scope.deck.name);
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
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Deck',
     template: 'Are you sure?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       DeckService.all().splice($scope.DeckIndex,$scope.DeckIndex+1);
     }
   });
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
  console.log($stateParams);

  $scope.closeDeck=function(){
    if($ionicHistory.backTitle()=="create new Deck"){
      $ionicHistory.nextViewOptions({
        disableBack: true,
        disableAnimate:true
      });
      $state.go('app.courses');
    }else{
    $ionicHistory.goBack();

    }
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
  //TODO return the mulitble states, ex learn etc
  var param = $stateParams.cardQuery.split("-");
  var DeckName = param[0];
  var DeckState= param[1]; //0-> all; 1-> learned; 2-> to learn
  $scope.names=param[0];
  $scope.deck= DeckService.getDeckByName(param[0]);
  $scope.done=false;
  $scope.index = 0;


  $scope.getWords = function(){ //function die die richtigen wörter auswählt
    if(DeckState==0){
      return $scope.deck.words;
    }else if (DeckState==1) {
      var selectedWords=[];
      for (var i = 0; i < $scope.deck.words.length; i++) {
        if($scope.deck.words[i].know==true){
          selectedWords.push($scope.deck.words[i]);
        }
      }
      return selectedWords;
    }else if (DeckState==2) {
      var selectedWords=[];
      for (var i = 0; i < $scope.deck.words.length; i++) {
        if($scope.deck.words[i].know==false){
          selectedWords.push($scope.deck.words[i]);
        }
      }
      return selectedWords;
    }
  }
  $scope.currentSelectedWords=$scope.getWords();
  $scope.currentCard =$scope.currentSelectedWords[$scope.index];
  $scope.showBothSides=true; //immer das gegenteil von dem was gerade gezeigt wird
  $scope.shuffle=false;


  $scope.changeKnow= function(){
    if($scope.currentCard.know==true){
      $scope.currentCard.know=false;
    }else{
      $scope.currentCard.know=true;
    }
  }

  $scope.getKnowColor=function(){
    if($scope.currentCard.know==true){
      return "button-balanced";
    }else{
      return "button-outline ";
    }
  }
  //functions gets called when you slide,
  //sets the index and resets the bottom card
  $scope.slideChanged=function(index){
    $scope.showBothSides=true;
    $scope.index = index;
    $scope.currentCard = $scope.currentSelectedWords[$scope.index];

  }

  $scope.showBack=function(){
    if($scope.showBothSides){
      $scope.showBothSides=false;
    }else{
      $scope.showBothSides=true;
    }
  }


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
