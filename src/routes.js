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
        // userAccounts: function(RestFactory, $window, $location, appConfig){
        //   var user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);
        //   if (angular.isDefined(user) && user !== null) {
        //     return RestFactory.getAccounts().then(function(response){
        //       if(angular.isDefined(response)){
        //         return response.plain();
        //       }
        //     })
        //   }else {
        //     $location.path('/');
        //   };
        // }
        userAccounts: function(){
          return {
            jsonrpc: 2.0,
            result:
            {
              status: "OK",
              message: {
                accounts:[
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"SPXBUAUK",
                    "number":"1234",
                    "amount":"10500",
                    "currency":"USD",
                    "type":"nostro",
                    "lastActivity":"2016-09-16T14:16:53.728",
                    "permissions":"transfer"
                  },
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"SPXBUAUK",
                    "number":"4321",
                    "amount":"500",
                    "currency":"USD",
                    "type":"vostro",
                    "lastActivity":"2016-09-16T14:17:21.757",
                    "permissions":"read"
                  },
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"SSXBUAU0",
                    "number":"1234",
                    "amount":"999",
                    "currency":"EUR",
                    "type":"nostro",
                    "lastActivity":"2016-09-16T14:17:14.050",
                    "permissions":"transfer"
                  },
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"APXBUAUK",
                    "number":"5555",
                    "amount":"500",
                    "currency":"USD",
                    "type":"nostro",
                    "lastActivity":"2016-09-16T14:16:53.728",
                    "permissions":"transfer"
                  },
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"SPXXUAUK",
                    "number":"2222",
                    "amount":"1000",
                    "currency":"USD",
                    "type":"vostro",
                    "lastActivity":"2016-09-16T14:17:21.757",
                    "permissions":"read"
                  },
                  {
                    "id": "eyJ0eXBlIjoiYWNjb3VudCIsImhvbGRlciI6IkNJVElVUzMzIiwib3duZXIiOiJTUFhCVUFVSyIsImN1cnJlbmN5IjoiVVNEIiwiYWNjb3VudFR5cGUiOiJ2b3N0cm8ifQ",
                    "bic":"SPXBUAU0",
                    "number":"3333",
                    "amount":"333",
                    "currency":"EUR",
                    "type":"vostro",
                    "lastActivity":"2016-09-16T14:17:14.050",
                    "permissions":"read"
                  }
                ]
              }
            },
            id: 5
          }
        //
        //   // return {
        //   //   "jsonrpc":"2.0",
        //   //   "result":{
        //   //     "status":"OK",
        //   //     "message":"{\"status\":\"Failure\",\"message\":\"BIC code or login or password you entered is incorrect.\"}"
        //   //   },
        //   //   "id":5
        //   // }
        }
      },
      url: '/accounts',
      component: 'accountsComponent'
    })
    .state('transactions', {
      url: '/transactions',
      component: 'transactionComponent',
      resolve: {
        userAccountTransactions: function(RestFactory, $window, $location, appConfig){
          var user = $window.localStorage.getObject(appConfig.LOCALSTORAGE_USER);
          if (angular.isDefined(user) && user !== null) {
            return RestFactory.getTransactionsForAccount(accountID, user.token).then(function(response){
              if(angular.isDefined(response)){
                return response.plain();
              }
            })
          }else {
            $location.path('/');
          };
        }
      }
    });
}
