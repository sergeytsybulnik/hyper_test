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

function TransactionController($scope, appConfig, $state, NgTableParams, $interval, RestFactory, $window, $timeout, $filter, ModalService){
  this.RestFactory = RestFactory;
  this.$window = $window;
  this.appConfig = appConfig;
  this.$interval = $interval;
  this.$timeout = $timeout;
  this.$state = $state;
  this.ModalService = ModalService;

  var _self = this;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  if(angular.isDefined(this.userAccountTransactions.result) && angular.isDefined(angular.fromJson(this.userAccountTransactions.result.message).transactions)
    && angular.fromJson(this.userAccountTransactions.result.message).transactions.length > 0){
    $scope.userAccountTransactions = this.calc(this.userAccountTransactions);
    if (angular.isDefined($scope.userAccountTransactions.transactions) && $scope.userAccountTransactions.transactions.length > 0 && $scope.userAccountTransactions.transactions !== null) {
      $scope.tableParams = new NgTableParams(
        {
          page: 1,
          // total: 1,
          count: 5,
          sorting: {
            status: "desc"
          }
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
  }else {
    _self.errorPresent = true;
    _self.errorMessage = "Transactions were not found";
  }


  var intervalPromise = $interval(function () {
    var token = _self.$window.localStorage.getObject(_self.appConfig.LOCALSTORAGE_USER).token;
    _self.RestFactory.getTransactionsForAccount(_self.$state.params.accountID, token).then(function (response) {
      if (angular.isDefined(response.plain())) {
        $scope.userAccountTransactions = _self.calc(response.plain());
      }
    });
  }, 10000);

  $scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });
};

TransactionController.prototype = {
  calc: function(data){
    var _self = this;
    var resp = data;

    if (angular.isDefined(resp.result.status) && resp.result.status === "OK") {

      var message = angular.fromJson(resp.result.message);

      if(angular.isDefined(message.transactions) && message.transactions.length > 0){
        return message;
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
    var _self = this;
    if (this.selectedItem !== item) {
      if (angular.isDefined(this.selectedItem) && this.selectedItem !== null) {
        this.selectedItem.$selectedItem = false;
        this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED);
      }
      this.selectedItem = item;
      this.selectedItem.$selectedItem = true;
      this.$window.localStorage.setObject(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED, this.selectedItem);
      this.ModalService.showModal({
        templateUrl: "app/containers/modal/TransactionDetails.html",
        controller: function($scope, close){

          function b64DecodeUnicode(str) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
          }

          $scope.close = function(result) {
            close('', 100); // close, but give 500ms for bootstrap to animate
          };
          $scope.title = "Transaction details";
          $scope.inputMessage = _self.selectedItem.details.inputMessage === null || _self.selectedItem.details.inputMessage === "" ? _self.selectedItem.details.inputMessage : b64DecodeUnicode(_self.selectedItem.details.inputMessage);
          $scope.outputMessage = _self.selectedItem.details.outputMessage === null || _self.selectedItem.details.outputMessage === "" ? _self.selectedItem.details.outputMessage : b64DecodeUnicode(_self.selectedItem.details.outputMessage);
          $scope.reason = _self.selectedItem.transactionStatus.comment === null || _self.selectedItem.transactionStatus.comment === "" ? _self.selectedItem.transactionStatus.comment : b64DecodeUnicode(_self.selectedItem.transactionStatus.comment);
        }
      }).then(function(modal) {
        modal.close.then(function(result) {
          this.customResult = "All good!";
        });
      });
    } else {
      this.selectedItem.$selectedItem = !this.selectedItem.$selectedItem;
      this.selectedItem = undefined;
      this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_TRANSACTION_SELECTED);
    }
  }
}
