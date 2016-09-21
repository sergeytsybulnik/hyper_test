angular
  .module('app')
  .component('accountsComponent', {
    templateUrl: 'app/components/Accounts.html',
    controller: AccountController,
    bindings: {
      userAccounts: '<',
      errorPresent: '=',
      errorMessage: '=',
      selectedItem: '='
    }
  });

function AccountController($scope, NgTableParams, $interval, RestFactory, $window, $timeout, $filter){
  this.RestFactory = RestFactory;
  this.$window = $window;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  $scope.userAccounts = this.calc();

  if($scope.userAccounts !== null){
    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        // total: 1,
        count: 2
      },
      {
        counts: [],
        // dataset: $scope.userAccounts
        getData: function ($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')($scope.userAccounts, params.filter()) :
            $scope.userAccounts;
          var orderedDate = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            filteredData;
          params.total(orderedDate.length);
          $defer.resolve($scope.userAccounts.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      }
    );
  }

  var c = 0;
  $scope.alertMessage = "This DIV is refreshed " + c + " time.";
  $interval(function () {
        $scope.userAccounts.push(
          {
            "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
            "bic": "SPXBUAUK",
            "number": 1234 + c,
            "amount": "10501",
            "currency": "USqqqD",
            "type": "nostro",
            "lastActivity": "2016-09-16T14:16:53.728",
            "permissions": "transfer"
          }
        );
    c++;
    $scope.alertMessage = "This DIV is refreshed " + c + " time.";
    // $timeout(function () {
    //   $scope.$apply(function () {
        console.info("Before: ", $scope.tableParams);
        console.info("Before l: ", $scope.userAccounts.length);
        $scope.tableParams.total($scope.userAccounts.length);
        $scope.tableParams.reload();
      // });
    // })
  }, 10000);

  // $scope.$watch('userAccounts', function(newValue, oldValue) {
  //   //this how we prevent second call
  //   if (newValue !== oldValue)
  //     console.log('watch');
  //     $scope.tableParams.total($scope.userAccounts.length);
  //     $scope.tableParams.reload();
  // });
};

AccountController.prototype = {
  calc: function(){

    var _self = this;
    var resp = _self.userAccounts;

    if(angular.isDefined(resp.result)){
      var message = angular.fromJson(resp.result.message);

      if (angular.isDefined(resp.result.status) && resp.result.status === "OK") {
      // if (angular.isDefined(message.status) && message.status === "OK") {
        _self.userAccounts = message.accounts;
        _self.$window.localStorage.setObject('hl_user_accounts', _self.userAccounts);
        return _self.userAccounts;
      } else if (message.status === "Failure") {
        _self.errorPresent = true;
        _self.errorMessage = message.message;
        return null;
      } else if (angular.isDefined(message.Error)) {
        _self.errorPresent = true;
        _self.errorMessage = message.Error;
        return null;
      }
    }else if(angular.isDefined(resp.error)){
      var error = angular.fromJson(resp.error);
      if(error.code === -32003 && error.message === "Query failure"){
        _self.errorPresent = true;
        _self.errorMessage = "Chaincode invocation failed, contact your system administrator.";
      }
      return null;
    }

  },

  getAccounts: function(){
    return this.RestFactory.getAccounts().then(function(response){
          this.calc();
    })
  },

  selectItem: function (item) {
    if (this.selectedItem !== item) {
      if (angular.isDefined(this.selectedItem) && this.selectedItem !== null) {
        this.selectedItem.$selectedItem = false;
      }
      this.selectedItem = item;
      this.selectedItem.$selectedItem = true;
    } else {
      this.selectedItem.$selectedItem = !this.selectedItem.$selectedItem;
      this.selectedItem = undefined;
    }
    console.log(this.selectedItem);
  }
};
