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
      //TO DO
      // var configurableParams = {
      //   params: {
      //     type: appConfig.TYPE,
      //     chaincodeID: {
      //       name: appConfig.CHAINCODEID_ACCOUNTS
      //     },
      //     ctorMsg: {
      //       function: appConfig.CHAINCODEID_ACCOUNTS_FUNC,
      //       args: [$window.localStorage.getObject(appConfig.LOCALSTORAGE_USER).token]
      //     }
      //   },
      //   id: appConfig.ID
      // };
      // var params = setParams(configurableParams);
      // return Restangular.all(defaultPathname).customPOST(params);
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
    },
    getTransactionsForAccount: function(accountID, token){
      console.log('accountID: ', accountID);
      console.log('token', token);
      //TO DO
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
          "message": "{\"accountState\":{\"amount\":\"123.45\",\"currency\":\"USD\"},\"transactions\":[{\"id\":\"9f750867-89e7-47f1-a560-ac2862abcf38\",\"transfer\":{\"counterparty\":{\"bic\":\"SPXBUAUK\",\"account\":\"453435\"},\"amount\":\"2425,00\",\"currency\":\"USD\",\"type\":\"debit\"},\"time\":\"2016-09-07T16:33:56Z\",\"status\":\"OK\",\"accountState\":{\"amount\":1000,\"currency\":\"USD\"},\"details\":{\"inputMessage\":\"ezE6RjAxU1BYQlVBVTFYWFhYMDAwMDAwMDAwMH17MjpJMTAzU1BYQlVBVTJYWFhYTn17Mzp7MTE5OlNUUH19ezQ6DQo6MjA6UEFZLzAwMw0KOjIzQjpDUkVEDQo6MzJBOjE2MDkyNlVTRDMyMiwwMA0KOjMzQjpVU0QzMjIsMDANCjo1MEs6L0FjY291bnRBDQpTRU5ERVJTIEFERFJFU1MNCjMwMjIyIFpVUklDSA0KOjU3QTpTUFhCVUFVMw0KOjU5QTovQWNjb3VudEINClJFQ0VJVkVSIEFERFJFU1MNCjE0NDU2IEdFTkVWQQ0KOjcwOk1vbmV5IHRyYW5zZmVyIHVzaW5nIEhMIGNvZGVjaGFpbg0KOjcxQTpPVVINCjo3MUc6VVNEMTIsMDANCi19\",\"outputMessage\":\"ezE6RjAxU1BYQlVBVTFYWFhYMDAwMDAwMDAwMH17MjpJMTAzU1BYQlVBVTJYWFhYTn17Mzp7MTE5OlNUUH19ezQ6DQo6MjA6UEFZLzAwMw0KOjIzQjpDUkVEDQo6MzJBOjE2MDkyNlVTRDMyMiwwMA0KOjMzQjpVU0QzMjIsMDANCjo1MEs6L0FjY291bnRBDQpTRU5ERVJTIEFERFJFU1MNCjMwMjIyIFpVUklDSA0KOjU3QTpTUFhCVUFVMw0KOjU5QTovQWNjb3VudEINClJFQ0VJVkVSIEFERFJFU1MNCjE0NDU2IEdFTkVWQQ0KOjcwOk1vbmV5IHRyYW5zZmVyIHVzaW5nIEhMIGNvZGVjaGFpbg0KOjcxQTpPVVINCjo3MUc6VVNEMTIsMDANCi19\",\"reason\":\"Output MT103 message has been generated\"}}]}",
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
    },

    //check if the specified message can be submitted with the current auth token
    checkPermissions: function(token, message){
      // var configurableParams = {
      //   params:{
      //     type: appConfig.TYPE,
      //     chaincodeID:{
      //       name: appConfig.CHAINCODEID_PERMISSIONS
      //     },
      //     ctorMsg:{
      //       function: appConfig.CHAINCODEID_PERMISSIONS_FUNC,
      //       args:[
      //         token,
      //         message//"<Body of the message from the form - needs to be Base64 encoded to be passed as json parameter>"
      //       ]
      //     }
      //   },
      //   id: appConfig.ID
      // };
      // var params = setParams(configurableParams);
      // return Restangular.all(defaultPathname).customPOST(params);
      return {
        "jsonrpc":"2.0",
        "result":{
          "status":"OK",
          "message":"{\"status\":\"OK\"}"
        },
        "id":5
      }
      // return {
      //   "jsonrpc":"2.0",
      //   "result":{
      //     "status":"OK",
      //     "message":"{\"status\":\"Failure\",\"message\":\"Authenticated user is not allowed to perform this transaction.\"}"
      //   },
      //   "id": 5
      // }
    },
    //
    transfer: function (token, message) {
      // var configurableParams = {
      //   jsonrpc: "2.0",
      //   method: "invoke",
      //   params:{
      //     type: appConfig.TYPE,
      //     chaincodeID:{
      //       name: appConfig.CHAINCODEID_TRANSFER//<Taken From The Properties File - the same as for prev query call>
      //     },
      //     ctorMsg:{
      //       function: appConfig.CHAINCODEID_TRANSFER_FUNC,
      //       args:[
      //         //TO DO: check true params
      //         token,
      //         message//<Body of the message from the form - needs to be Base64 encoded to be passed as json parameter>
      //       ]
      //     }
      //   },
      //   id: appConfig.ID
      // };
      // return Restangular.all(defaultPathname).customPOST(configurableParams);
      return {"jsonrpc":"2.0","result":{"status":"OK","message":"9f750867-89e7-47f1-a560-ac2862abcf38"},"id":5};
    }
  }
});

