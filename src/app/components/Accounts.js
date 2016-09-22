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

function AccountController($scope, appConfig, NgTableParams, $interval, RestFactory, $window, $filter, ModalService, $state){
  this.RestFactory = RestFactory;
  this.$window = $window;
  this.appConfig = appConfig;
  this.$state = $state;
  this.$interval = $interval;
  this.ModalService = ModalService;

  this.$onInit = function () {
    this.errorPresent = this.errorPresent || false;
    this.errorMessage = this.errorMessage || '';
    this.selectedItem = undefined;
  };

  var _self = this;

  $scope.userAccounts = _self.calc(_self.userAccounts);

  if($scope.userAccounts !== null){
    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        // total: 1,
        count: 5
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
          $defer.resolve(orderedDate.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      }
    );
  }

  var c = 0;
  _self.$interval(function () {
    $scope.userAccounts[0].number = $scope.userAccounts[0].number - c;
    $scope.userAccounts[0].amount = $scope.userAccounts[0].amount - c;

    $scope.tableParams.total($scope.userAccounts.length);
    $scope.tableParams.reload();

    //TO DO: check/fix response

    // _self.getAccounts().then(function (response) {
    //   if (angular.isDefined(response.plain())) {
    //     $scope.userAccounts = _self.calc(response.plain());
    //   }
    // });

    c++;
    // $scope.$watch('userAccounts', function(newValue, oldValue){
    //   if(angular.isDefined(newValue) && newValue !== oldValue){
    //     $scope.tableParams.total($scope.userAccounts.length);
    //     $scope.tableParams.reload();
    //   }
    // });
  }, 5000);

};

AccountController.prototype = {
  calc: function(data){

    var _self = this;
    var resp = data;

    if(angular.isDefined(resp.result)){
      var message = angular.fromJson(resp.result.message);

      if (angular.isDefined(resp.result.status) && resp.result.status === "OK") {
      // if (angular.isDefined(message.status) && message.status === "OK") {
        _self.userAccounts = message.accounts;
        _self.$window.localStorage.setObject(_self.appConfig.LOCALSTORAGE_USER + _self.appConfig.LOCALSTORAGE_USER_ACCOUNTS, _self.userAccounts);
        _self.errorPresent = false;
        _self.errorMessage = "";
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
    var data = this.RestFactory.getAccounts();
    _self.calc(data)
    //TO DO
    // return this.RestFactory.getAccounts().then(function(response){
    //   _self.calc();
    // })
  },

  // getTransactionsForAccount: function(){
  //   var token = this.$window.localStorage.getObject(this.appConfig.LOCALSTORAGE_USER).token;
  //   var resp = this.RestFactory.getTransactionsForAccount(this.selectedItem.id, token);
  //   console.log('TRANSACTIONS: ', resp);
  //
  //   // this.RestFactory.getTransactionsForAccount(this.selectedItem.id, token).then(function(response){
  //   //   console.log('TRANSACTIONS: ', response.plain());
  //   //   if(angular.isDefined(response.plain())) {
  //
  //       // var resp = response.plain();
  //       if(angular.isDefined(resp.transactions) && resp.transactions.length > 0){
  //         if (angular.isDefined(message.status) && message.status === "OK") {
  //
  //         }else{
  //
  //         }
  //
  //       }else if(angular.isDefined(resp.error)){
  //         var error = angular.fromJson(resp.error);
  //         if(error.code === -32003 && error.message === _self.appConfig.QUERY_FAILURE){
  //           _self.errorPresent = true;
  //           _self.errorMessage = _self.appConfig.GENERIC_ERROR;
  //         }
  //         return null;
  //       }
  //     // }
  //
  //   // });
  // },

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
      this.$state.go("transactions", {accountID: this.selectedItem.id});
    } else {
      this.selectedItem.$selectedItem = !this.selectedItem.$selectedItem;
      this.selectedItem = undefined;
      this.$window.localStorage.removeItem(this.appConfig.LOCALSTORAGE_USER + this.appConfig.LOCALSTORAGE_USER_ACCOUNT_SELECTED);
    }
  },

  transferModal: function(){
    var _self = this
    _self.ModalService.showModal({
      templateUrl: "app/containers/modal/Transfer.html",
      controller: function($scope, close){

        $scope.title = "Transfer";

        function b64EncodeUnicode(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
        };

        $scope.message = undefined;

        $scope.close = function(result) {
          console.log(result);
          close({
            message: result === 'yes' ? b64EncodeUnicode($scope.message) : 'no'
          }, 100); // close, but give 500ms for bootstrap to animate
        };

      }
    }).then(function(modal) {
      modal.close.then(function(result) {
        if(result.message !== 'no') {
          var user = _self.$window.localStorage.getObject(_self.appConfig.LOCALSTORAGE_USER);
          // _self.RestFactory.checkPermissions(user.token, result.message).then(function(response){
          //   if(angular.isDefined(response.plain())){
          //     var resp = response.plain();

              var resp = _self.RestFactory.checkPermissions(user.token, result.message);

              var message = angular.fromJson(resp.result.message);
              if(resp.result.status === "OK" && message.status === "OK"){
                console.info('TRANSFER SUCCESSFULL: ', _self.RestFactory.transfer(user.token, result.message));
                // _self.RestFactory.transfer(user.token, result.message).then(function(response){
                //   //TO DO
                //   console.log(response);
                // })
              }else{
                _self.errorPresent = true;
                _self.errorMessage = message.message;
                return null;
              }
            // }else if(angular.isDefined(resp.error)){
            //     var error = angular.fromJson(resp.error);
            //     if(error.code === -32003 && error.message === _self.appConfig.QUERY_FAILURE){
            //       _self.errorPresent = true;
            //       _self.errorMessage = _self.appConfig.GENERIC_ERROR;
            //     }
            //     return null;
            //   }
          // });
        }
      });
    });
  }
};
