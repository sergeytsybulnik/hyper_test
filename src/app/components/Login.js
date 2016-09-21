angular
  .module('app')
  .component('loginComponent', {
    templateUrl: 'app/components/Login.html',
    controller: LoginController,
    bindings: {
      errorPresent: '@',
      errorMessage: '@'
    }
  });

function LoginController(RestFactory, $location, $window, $timeout) {
  this.RestFactory = RestFactory;
  this.$location = $location;
  this.$window = $window;
  this.$timeout = $timeout;

  this.errorPresent = this.errorPresent || false;
  this.errorMessage = this.errorMessage || '';

  // this.$onChanges = function() {
  //   $timeout(function () {
  //     this.errorPresent = true;
  // //     // $scope.errorMessage = "BIC code or login or password you entered is incorrect.";
  //     this.errorMessage = "Incorrect number of arguments. Expecting 3 arguments: bic,login,password";
  //     console.log(this);
  //   }, 3000);
  // // };
};

LoginController.prototype = {
  submitForm: function (isValid) {

    var _self = this;

    function calc(resp){

      if(angular.isDefined(resp.result)){
        var message = angular.fromJson(resp.result.message);

        if (angular.isDefined(message.status) && message.status === "OK") {
          _self.currentUser = angular.extend({}, _self.user, {
            bic: _self.bic,
            token: message.authToken
          });
          _self.$window.localStorage.setObject('hl_user', _self.currentUser);
          _self.$location.path('/accounts');
        } else if (message.status === "Failure") {
          _self.errorPresent = true;
          _self.errorMessage = message.message;
        } else if (angular.isDefined(message.Error)) {
          _self.errorPresent = true;
          _self.errorMessage = message.Error;
        }
      }else if(angular.isDefined(resp.error)){
        var error = angular.fromJson(resp.error);
        if(error.code === -32003 && error.message === "Query failure"){
          _self.errorPresent = true;
          _self.errorMessage = "Chaincode invocation failed, contact your system administrator.";
        }
      }
      
    }

    if (isValid) {
      var dataForLogin = {
        bic: _self.bic,
        username: _self.user.username,
        pwd: _self.password
      };
      _self.RestFactory.login(dataForLogin).then(function (response) {
        if (angular.isDefined(response.plain())) {
          var resp = response.plain();
          calc(resp);
        }
      });
    }
  }
}

