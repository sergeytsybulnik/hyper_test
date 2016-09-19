angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('site', {
      abstract: true,
      resolve: {
        userResolve: function (RestFactory) {
          return RestFactory.initUser();
        }
      }
    })
    .state('app', {
      url: '/',
      component: 'app'
    })
    .state('accounts', {
      url: '/accounts',
      component: 'accountsComponent'
    })
    .state('transactions', {
      url: '/transactions'
      // component: 'accountComponent'
    });
}
