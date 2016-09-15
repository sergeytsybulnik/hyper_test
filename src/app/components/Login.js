angular
  .module('app')
  .component('loginComponent', {
    templateUrl: 'app/components/Login.html',
    controller: LoginController
  });

function LoginController() {
  this.bic = 'SWFLJRMW';
}
