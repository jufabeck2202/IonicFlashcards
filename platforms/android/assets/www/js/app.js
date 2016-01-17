// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({name: "decks.db"});
    $cordovaSQLite.excute(db,"CREATE TABLE IF NOT EXISTS(id integer primary key,frontside text, backside text, know boolean)");
    



  });
})
.factory("DeckService", function(){

    var decks=[{
      name:"TestDeck",
      words:[{frontside:"karte1",backside:"card1",know:true},
      {frontside:"karte2",backside:"card2",know:false}] 
        
    }];
    return{
    all:function(){
      return decks;
    },
    add:function(deck){
      decks.push(deck);
    },
    update:function(deckname,deck){
      for (var i = decks.length - 1; i >= 0; i--) {
        if (decks[i].name==deckname) {          
          decks.splice(i);
          decks.push(deck);
          break;
        };
      };
    },
    getByName:function(name){
      for (var i = decks.length - 1; i >= 0; i--) {
        if (decks[i].name==name) {
          return decks[i]
        };
      };
      return null;
    },
    getLearnedCount:function(name){
      for (var i = decks.length - 1; i >= 0; i--) {
        if (decks[i].name==name) {
          var count =0;
          for (var j = 0; j< decks[i].words.length;j++) {
            if(decks[i].words[j].know==true){
             
              count++;
            }            
          };
          return count;
        };
      };
      return null;
    }
  }

  
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.courses', {
      url: '/courses',
      views: {
        'menuContent': {
          templateUrl: 'templates/courses.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('app.cardQuery', {
      url: '/courses/:deckName/:cardQuery',
      views: {
        'menuContent': {
          templateUrl: 'templates/cardQuery.html',
          controller: 'CardQueryCtrl'
        }
      }
    })
    .state('app.courseInfo', {
      url: '/courses/:deckName',
      views: {
        'menuContent': {
          templateUrl: 'templates/courseInfo.html',
          controller: 'CourseInfoCtrl'
        }
      }
    })
    .state('app.createDeck', {
      url: '/createDeck',
      views: {
        'menuContent': {
          templateUrl: 'templates/createDeck.html',
          controller: "CreateDeckCtrl"
        }
      }
    })
    .state('app.addCards', {
      url: '/createDeck/:addCards',
      views: {
        'menuContent': {
          templateUrl: 'templates/addCards.html',
          controller: "AddCardsCtrl"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/courses');
});