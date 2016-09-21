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

function AccountController($scope, appConfig, NgTableParams, $interval, RestFactory, $window, $timeout, $filter, ModalService){
  this.RestFactory = RestFactory;
  this.$window = $window;
  this.appConfig = appConfig;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  var _self = this;

  $scope.userAccounts = _self.calc();

  if($scope.userAccounts !== null){
    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        // total: 1,
        count: 10
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
  // $scope.alertMessage = "This DIV is refreshed " + c + " time.";
  $interval(function () {
        $scope.userAccounts.push(
          {
            "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
            "bic": "SPXBUAUK",
            "number": 1234 + c,
            "amount": 10501 + c,
            "currency": "EUR",
            "type": "vostro",
            "lastActivity": "2016-09-16T14:16:53.728",
            "permissions": "read"
          }
        );

    $scope.tableParams.total($scope.userAccounts.length);
    $scope.tableParams.reload();

    //TO DO: check/fix response

    // _self.getAccounts().then(function(response){
    //   console.log(response);
    //   $scope.userAccounts = response;
    // });

    c++;
    // $scope.alertMessage = "This DIV is refreshed " + c + " time.";
    // $scope.$watch('userAccounts', function(newValue, oldValue){
    //   if(angular.isDefined(newValue) && newValue !== oldValue){
    //     $scope.tableParams.total($scope.userAccounts.length);
    //     $scope.tableParams.reload();
    //   }
    // });
  }, 10000);
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
        _self.$window.localStorage.setObject(_self.appConfig.LOCALSTORAGE_USER + _self.appConfig.LOCALSTORAGE_USER_ACCOUNTS, _self.userAccounts);
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
      if(error.code === -32003 && error.message === _self.appConfig.QUERY_FAILURE){
        _self.errorPresent = true;
        _self.errorMessage = _self.appConfig.GENERIC_ERROR;
      }
      return null;
    }

  },

  getAccounts: function(){
    var _self = this;
    return this.RestFactory.getAccounts().then(function(response){
      _self.calc();
    })
  },

  getTransactionsForAccount: function(){
    var token = this.$window.localStorage.getObject(this.appConfig.LOCALSTORAGE_USER).token;
    var resp = this.RestFactory.getTransactionsForAccount(this.selectedItem.id, token);
    console.log('TRANSACTIONS: ', resp);

    // this.RestFactory.getTransactionsForAccount(this.selectedItem.id, token).then(function(response){
    //   console.log('TRANSACTIONS: ', response.plain());
    //   if(angular.isDefined(response.plain())) {

        // var resp = response.plain();
        if(angular.isDefined(resp.transactions) && resp.transactions.length > 0){
          if (angular.isDefined(message.status) && message.status === "OK") {

          }else{

          }

        }else if(angular.isDefined(resp.error)){
          var error = angular.fromJson(resp.error);
          if(error.code === -32003 && error.message === _self.appConfig.QUERY_FAILURE){
            _self.errorPresent = true;
            _self.errorMessage = _self.appConfig.GENERIC_ERROR;
          }
          return null;
        }
      // }

    // });
  },

  selectItem: function (item) {
    if (this.selectedItem !== item) {
      if (angular.isDefined(this.selectedItem) && this.selectedItem !== null) {
        this.selectedItem.$selectedItem = false;
        this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_ACCOUNT_SELECTED);
      }
      this.selectedItem = item;
      this.selectedItem.$selectedItem = true;
      this.$window.localStorage.setObject(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_ACCOUNT_SELECTED, this.selectedItem);
      // console.log(this.selectedItem);
      this.getTransactionsForAccount();
    } else {
      this.selectedItem.$selectedItem = !this.selectedItem.$selectedItem;
      this.selectedItem = undefined;
      this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_ACCOUNT_SELECTED);
    }
  }
};
