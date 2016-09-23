angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      resolve: {
        userResolve: function ($window, $location, appConfig) {
          var user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);
          if (angular.isDefined(user) && user !== null) {
            console.log('User has been already stored!');
            $location.path('/accounts');
          } else {
            // alert('Please, login');
            $location.path('/');
          };
        }
      },
      url: '/',
      component: 'app',
      // onEnter: function(){
      //   document.body.className = "bg";
      // }
    })
    .state('accounts', {
      resolve: {
        //TO DO
        userAccounts: function(RestFactory, $window, $location, appConfig){
          var user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);
          if (angular.isDefined(user) && user !== null) {
            return RestFactory.getAccounts().then(function(response){
              if(angular.isDefined(response)){
                return response.plain();
              }
            })
          }else {
            $location.path('/');
          };
        }
      },
      url: '/accounts',
      component: 'accountsComponent'
    })
    .state('transactions', {
      url: '/transactions/:accountID',
      component: 'transactionComponent',
      resolve: {
        userAccountTransactions: function(RestFactory, $window, $location, appConfig, $stateParams){
          var user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);
          // var account = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER + appConfig.LOCALSTORAGE_USER_ACCOUNT_SELECTED);
          if (angular.isDefined(user) && user !== null) {
            if(angular.isDefined($stateParams.accountID) && $stateParams.accountID.length > 0 && $stateParams.accountID !== null){
              //TO DO
              return RestFactory.getTransactionsForAccount($stateParams.accountID, user.token).then(function(response){
                if(angular.isDefined(response)){
                  return response.plain();
                }
              })
            }else {
              $location.path('/accounts');
            };
          }else {
            $location.path('/');
          };
        }
      }
    });
}
