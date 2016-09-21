angular.module('app').factory('RestFactory',  function(Restangular, $q, $window, appConfig){

  var defaultParams = {"jsonrpc": "2.0", "method": "query"};

  var defaultPathname = appConfig.CHAINCODE;

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
            type: appConfig.TYPE,
            chaincodeID: {
              name: appConfig.CHAINCODEID_LOGIN
            },
            ctorMsg: {
              function: appConfig.CHAINCODEID_LOGIN_FUNC,
              args: [data.bic, data.username, data.pwd]
              // args:[ "SPXBUAUK","super","Abcd1234" ]
            }
          },
          id: appConfig.ID
        };
      }
      var params = setParams(configurableParams);
      return Restangular.all(defaultPathname).customPOST(params);
    },
    logout: function(){
      $window.localStorage.clear();
      $window.location.href = window.location.origin;
    },
    getAccounts: function(){
      var configurableParams = {
        params: {
          type: appConfig.TYPE,
          chaincodeID: {
            name: appConfig.CHAINCODEID_ACCOUNTS
          },
          ctorMsg: {
            function: appConfig.CHAINCODEID_ACCOUNTS_FUNC,
            args: [$window.localStorage.getObject(appConfig.LOCALSTORAGE_USER).token]
          }
        },
        id: appConfig.ID
      };
      var params = setParams(configurableParams);
      return Restangular.all(defaultPathname).customPOST(params);
    },
    getTransactionsForAccount: function(accountID, token){
      console.log('accountID: ', accountID);
      console.log('token', token);
      // var configurableParams = {
      //   params:{
      //     type: appConfig.TYPE,
      //     chaincodeID:{
      //       name: appConfig.CHAINCODEID_TRANSACTIONS
      //     },
      //     ctorMsg:{
      //       function: appConfig.CHAINCODEID_TRANSACTIONS_FUNC,
      //       args:[
      //         token,
      //         accountID
      //       ]
      //     }
      //   },
      //   id: appConfig.ID
      // };
      // var params = setParams(configurableParams);
      // return Restangular.all(defaultPathname).customPOST(params);
      return {
        "jsonrpc": "2.0",
        "result": {
          "status": "OK",
          "message": "{\"accountState\":{\"amount\":\"123.45\",\"currency\":\"USD\"},\"transactions\":[{\"id\":\"9f750867-89e7-47f1-a560-ac2862abcf38\",\"transfer\":{\"counterparty\":{\"bic\":\"SPXBUAUK\",\"account\":\"453435\"},\"amount\":\"2425,00\",\"currency\":\"USD\",\"type\":\"debit\"},\"time\":\"2016-09-07T16:33:56Z\",\"status\":\"OK\",\"accountState\":{\"amount\":1000,\"currency\":\"USD\"},\"details\":{\"inputMessage\":\"base64EncodedInputMessage\",\"outputMessage\":\"base64EncodedOutputMessage\",\"reason\":\"Output MT103 message has been generated\"}}]}",
          id: 5
        }
      }

      // return {
      //   "accountState":{
      //     "amount":"123.45",
      //     "currency":"USD"
      //   },
      //   "transactions":[
      //     {
      //       "id":"9f750867-89e7-47f1-a560-ac2862abcf38",
      //       "transfer":{
      //         "counterparty":{
      //           "bic":"SPXBUAU1",
      //           "account":"453435"
      //         },
      //         "amount":"2425,00",
      //         "currency":"USD",
      //         "type":"debit"
      //       },
      //       "time":"2016-09-07T16:33:56Z",
      //       "status":"OK",
      //       "accountState":{
      //         "amount":1000,
      //         "currency":"USD"
      //       },
      //       "details":{
      //         "inputMessage":"base64EncodedInputMessage",
      //         "outputMessage":"base64EncodedOutputMessage",
      //         "reason":"Output MT103 message has been generated"
      //       }
      //     },
      //     {
      //       "id":"9f750867-89e7-47f1-a560-ac2862abcf38",
      //       "transfer":{
      //         "counterparty":{
      //           "bic":"SPXBUAU2",
      //           "account":"453436"
      //         },
      //         "amount":"3425,00",
      //         "currency":"EUR",
      //         "type":"credit"
      //       },
      //       "time":"2016-09-07T16:33:56Z",
      //       "status":"OK",
      //       "accountState":{
      //         "amount":500,
      //         "currency":"EUR"
      //       },
      //       "details":{
      //         "inputMessage":"base64EncodedInputMessage",
      //         "outputMessage":"base64EncodedOutputMessage",
      //         "reason":"Output MT103 message has been generated"
      //       }
      //     }
      //   ]
      // }
    }
  }
});

