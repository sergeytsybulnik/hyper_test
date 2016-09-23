angular
  .module('app', ['ui.router', 'restangular', 'ngTable', 'angularModalService', 'ngAnimate'])
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
  .config(function(RestangularProvider, appConfig) {
    RestangularProvider.setBaseUrl(appConfig.ENDPOINT+appConfig.ENDPOINT_PORT);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

  })
  .service('todoService', TodoService);

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, angular.toJson(value));
}

Storage.prototype.getObject = function(key) {
  return angular.fromJson(this.getItem(key));
};


