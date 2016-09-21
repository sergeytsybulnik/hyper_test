angular
  .module('app')
  .component('transactionComponent', {
    templateUrl: 'app/components/Transactions.html',
    controller: TransactionController,
    bindings: {
      userAccountTransactions: '<',
      errorPresent: '=',
      errorMessage: '='
    }
  });

function TransactionController($scope, appConfig, NgTableParams, $interval, RestFactory, $window, $timeout, $filter, ModalService){
  this.RestFactory = RestFactory;
  this.$window = $window;
  this.appConfig = appConfig;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  $scope.userAccountTransactions = this.calc();

  if($scope.userAccountTransactions.transactions !== null){
    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        // total: 1,
        count: 10
      },
      {
        counts: [],
        getData: function ($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')($scope.userAccountTransactions.transactions, params.filter()) :
            $scope.userAccountTransactions.transactions;
          var orderedDate = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            filteredData;
          params.total(orderedDate.length);
          $defer.resolve($scope.userAccountTransactions.transactions.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      }
    );
  }
};

TransactionController.prototype = {
  calc: function(){
    var _self = this;
    var resp = _self.userAccountTransactions;

    if (angular.isDefined(resp.status) && resp.status === "OK") {

      var message = angular.fromJson(resp.message);

      if(angular.isDefined(message.transactions) && message.transactions.length > 0){
        return message
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
  selectItem: function (item) {
    if (this.selectedItem !== item) {
      if (angular.isDefined(this.selectedItem) && this.selectedItem !== null) {
        this.selectedItem.$selectedItem = false;
        this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED);
      }
      this.selectedItem = item;
      this.selectedItem.$selectedItem = true;
      this.$window.localStorage.setObject(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED, this.selectedItem);
    } else {
      this.selectedItem.$selectedItem = !this.selectedItem.$selectedItem;
      this.selectedItem = undefined;
      this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED);
    }
  }
}
