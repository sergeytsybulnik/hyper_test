angular
  .module('app')
  .component('headerComponent', {
    templateUrl: 'app/components/Header.html',
    controller: Header,
    bindings: {
      // todos: '=',
    }
  });

/** @ngInject */
function Header(todoService, $window, RestFactory, appConfig) {
  // this.todoService = todoService;
  this.userIsPresent = false;
  this.rests = RestFactory;

  this.user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);

  if(angular.isDefined(this.user) && this.user !== null){
    this.userIsPresent = true;
  }
}

Header.prototype = {
  Logout: function(){
    this.rests.logout();
  },
  handleSave: function (text) {
    if (text.length !== 0) {
      this.todos = this.todoService.addTodo(text, this.todos);
    }
  }
};
