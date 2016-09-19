angular.module('app').factory('RestFactory',  function(Restangular, $q, $window){

  var defaultParams = {"jsonrpc": "2.0", "method": "query"};
  var isDefined = function(value) {
    return angular.isDefined(value) && value !== null;
  }
  var setParams = function(configurableParams){
    return angular.extend({}, defaultParams, configurableParams)
  }

  return {
    login: function(data){
      if(isDefined(data) && isDefined(data.bic) && isDefined(data.username) && isDefined(data.pwd)){
        var configurableParams = {
          params:
          {
            type: 1,
            chaincodeID:{ name:"UserManagement" },
            ctorMsg: {
              function:"login",
              args: [data.bic, data.username, data.pwd]
              // args:[ "SPXBUAUK","super","Abcd1234" ]
            }
          },
          id: 5 };
      }
      var params = setParams(configurableParams);
      return Restangular.all('chaincode').customPOST(params);
    },
    logout: function(){
      $window.localStorage.clear();
      $window.location.href = window.location.origin;
    },
    getAccounts: function(){
      var configurableParams = {
        params: {
          type: 1,
          chaincodeID: {name: "AccountsManagement"},
          ctorMsg: {function: "listAccounts", args: [$window.localStorage.getItem('hl_user').token]},
          id: 5
        }
      };
      var params = setParams(configurableParams);
      return Restangular.all('chaincode').customPOST(params);
    }
  }
});

