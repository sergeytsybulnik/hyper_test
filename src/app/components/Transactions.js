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
  this.$state = $state;
  this.ModalService = ModalService;

  var _self = this;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  $scope.userAccountTransactions = this.calc(this.userAccountTransactions);

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

  var c = 0;
  _self.$interval(function () {
    var token = _self.$window.localStorage.getObject(_self.appConfig.LOCALSTORAGE_USER).token;
    $scope.userAccountTransactions.transactions[0].transfer.amount = parseInt($scope.userAccountTransactions.transactions[0].transfer.amount) - c +',00';
    //TO DO
    // _self.RestFactory.getTransactionsForAccount(_self.$state.params.accountID, token).then(function (response) {
    //   if (angular.isDefined(response.plain())) {
    //     $scope.userAccountTransactions = _self.calc(response.plain());
    //   }
    // });
    c++;
  }, 5000);
};

TransactionController.prototype = {
  calc: function(data){
    var _self = this;
    var resp = data;

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
          $scope.inputMessage = b64DecodeUnicode(_self.selectedItem.details.inputMessage);
          $scope.outputMessage = b64DecodeUnicode(_self.selectedItem.details.outputMessage);
          $scope.reason = b64DecodeUnicode(_self.selectedItem.transactionStatus.comment);
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
