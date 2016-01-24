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
 $scope.word=getWord();
 $scope.frontside=$scope.word.frontside;
 $scope.backside=$scope.word.backside;



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
       $state.go("app.courses");
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
        know:false,
        pos:null
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



.controller('CardQueryCtrl',function($scope,$stateParams,$state,DeckService){
  //TODO return the mulitble states, ex learn etc
  var param = $stateParams.cardQuery.split("-");
  var DeckName = param[0];
  var DeckState= param[1]; //0-> all; 1-> learned; 2-> to learn
  $scope.names=param[0];
  $scope.deck= DeckService.getDeckByName(param[0]);
  //function die die richtigen wörter auswählt
  $scope.getWords = function(){
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

  $scope.index = 0;
  $scope.currentSelectedWords=$scope.getWords();

  //reset of the id in beginn of the view
  for (var i = $scope.currentSelectedWords.length-1; i >=0; i--) {
    $scope.currentSelectedWords[i].pos=i;
    console.log($scope.currentSelectedWords[i].pos);
  }
//return the card with the matching pos
  $scope.posHandler = function(pos){
    for (var i = 0; i < $scope.currentSelectedWords.length; i++) {
      if($scope.currentSelectedWords[i].pos==pos){
          return $scope.currentSelectedWords[i];
      }
    }
  }
  $scope.currentCard =$scope.posHandler($scope.index);
  $scope.showBothSides=true; //immer das gegenteil von dem was gerade gezeigt wird
  $scope.shuffle=false;
  $scope.switch=false;
  $scope.cardTop=null;
  $scope.cardBottom=null;

  var setWords = function(){
    if($scope.switch==false){
      $scope.cardTop=$scope.currentCard.frontside;
      $scope.cardBottom=$scope.currentCard.backside;
    }else {
      $scope.cardTop=$scope.currentCard.backside;
      $scope.cardBottom=$scope.currentCard.frontside;
    }
  };
  setWords();

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
  //->updates everything.
  $scope.slideChanged=function(index){
    $scope.showBothSides=true;
    $scope.index = index;

    $scope.currentCard = $scope.posHandler($scope.index);
    setWords();

  }

  $scope.showBack=function(){
    if($scope.showBothSides){
      $scope.showBothSides=false;
    }else{
      $scope.showBothSides=true;
    }
  }

  //popover functions for shuffle switch edit and delete
  $scope.shuffleCards=function() {
    for (var i = $scope.currentSelectedWords.length-1; i >=0; i--) {
      $scope.currentSelectedWords[i].pos=null;
    }

    var size = $scope.currentSelectedWords.length;
    Math.floor((Math.random() * $scope.currentSelectedWords.length));
    var tempIndex=0;

    while(tempIndex<size){
      var value = Math.floor((Math.random() * $scope.currentSelectedWords.length));
      var alreadyIn = false;
      for (var i = 0; i < size; i++) {
        if($scope.currentSelectedWords[i].pos==value){
          alreadyIn=true;
        }
      }
      if(!alreadyIn){
        $scope.currentSelectedWords[tempIndex].pos=value;
        tempIndex++;
      }
    }
    $scope.showBothSides=true;
    $scope.currentCard = $scope.posHandler($scope.index);
    setWords();
  }

  $scope.switchCards=function() {
    if($scope.switch){
      $scope.switch=false;
    }else{
      $scope.switch=true;
    }
    setWords()
  }

})
.controller('AboutCtrl',function($scope,$stateParams,$state,DeckService){
  $scope.twitter=function(){
    window.open('http://apache.org', '_blank', 'location=yes');
  }
});
