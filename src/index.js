angular
  .module('app', ['ui.router', 'restangular', 'ngTable']);

angular.module('app').run(function($rootScope, $state){
    if ('localStorage' in window && window['localStorage'] !== null) {
      // we can use localStorage object to store data
      console.info('We can use LocalStorage!');
      return true;
    } else {
      console.info("We can't use LocalStorage!");
      return false;
    }
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log('fromState : ', fromState);
      console.log('toState : ', toState);
    });
  });
angular.module('app').config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://192.168.0.246:7050/');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

  })
  .service('todoService', TodoService);

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, angular.toJson(value));
}

Storage.prototype.getObject = function(key) {
  return angular.fromJson(this.getItem(key));
};

// function domReady () {
//   document.body.className += "bg";
//   // ...
// }
//
// if ( document.addEventListener ) {
//   document.addEventListener( "DOMContentLoaded", function(){
//     document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
//     domReady();
//   }, false );
//
// // If IE event model is used
// }else if ( document.attachEvent ) {
//   // ensure firing before onload
//   document.attachEvent("onreadystatechange", function(){
//     if ( document.readyState === "complete" ) {
//       document.detachEvent( "onreadystatechange", arguments.callee );
//       domReady();
//     }
//   });
// }


