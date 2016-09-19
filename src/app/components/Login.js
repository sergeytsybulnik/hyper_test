angular
  .module('app')
  .component('loginComponent', {
    templateUrl: 'app/components/Login.html',
    bindings: {
      errorPresent: '&',
      errorMessage: '@'
    },
    controller: LoginController
  });

function LoginController(RestFactory, $location, $window) {
  this.errorPresent = false;
  this.errorMessage = "";
  this.submitForm = function (isValid) {
    if (isValid) {
      var dataForLogin = {
        bic: this.bic,
        username: this.user.username,
        pwd: this.password
      }
      RestFactory.login(dataForLogin).then(function (response) {
        if (angular.isDefined(response.plain())) {

          var resp = response.plain();

          var message = angular.fromJson(resp.result.message);

          if (angular.isDefined(message.status) && message.status === "OK") {
            angular.extend(this.user, {
              bic: this.bic,
              token: message.authToken
            });
            $window.localStorage.setObject('hl_user', $scope.user);
            $location.path('/accounts');

          } else if (message.status === "Failure") {
            this.errorPresent = true;
            this.errorMessage = message.message;
          } else if (angular.isDefined(message.Error)) {
            this.errorPresent = true;
            this.errorMessage = message.Error;
          }
        }
        console.log(response);
      });
    }
  };
}
