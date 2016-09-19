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
function Header(todoService, $window) {
  // this.todoService = todoService;
  this.userIsPresent = false;

  this.user = $window.localStorage.getObject('hl_user');

  if(angular.isDefined(this.user) && this.user !== null){
    this.userIsPresent = true;
  }
}

Header.prototype = {
  handleSave: function (text) {
    if (text.length !== 0) {
      this.todos = this.todoService.addTodo(text, this.todos);
    }
  }
};
