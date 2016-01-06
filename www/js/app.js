// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
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
  });
})
.factory("DeckService", function(){

    var decks=[{
      name:"TestDeck",
      words:[{Haus:"house",know:false},{Pferd:"horse",know:false}] 
        
    }];
    return{
    all:function(){
      return decks;
    },
    add:function(deck){
      decks.push(deck);
    },
    getByName:function(name){
      for (var i = decks.length - 1; i >= 0; i--) {
        if (decks[i].name==name) {
          return decks[i]
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
      url: '/courses/:cardQuery',
      views: {
        'menuContent': {
          templateUrl: 'templates/cardQuery.html',
          controller: 'CardQueryCtrl'
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
      url: '/createDeck/addCards',
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
