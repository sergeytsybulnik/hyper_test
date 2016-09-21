angular
  .module('app')
  .component('transactionComponent', {
    templateUrl: 'app/components/Transactions.html',
    controller: TransactionController,
    bindings: {
      userAccountTransaction: '<',
      errorPresent: '=',
      errorMessage: '='
    }
  });

function TransactionController($scope, appConfig, NgTableParams, $interval, RestFactory, $window, $timeout, $filter, ModalService){

}
