angular
  .module('app', ['ui.router', 'restangular'])
  .run(function(){
    if ('localStorage' in window && window['localStorage'] !== null) {
      // we can use localStorage object to store data
      console.info('We can use LocalStorage!');
      return true;
    } else {
      console.info("We can't use LocalStorage!");
      return false;
    }
  })
  .config(function(RestangularProvider) {
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
