"use strict";

angular.module('app')
  .constant('appConfig', {
    ENDPOINT: "http://192.168.0.73:7050/",
    ENDPOINT_PORT: "7050",
    CHAINCODE: "chaincode",
    CHAINCODEID_LOGIN: "UserManagement",
    CHAINCODEID_LOGIN_FUNC: "login",
    CHAINCODEID_ACCOUNTS: "AccountManagement",//<Taken From The Properties File - Differs from the login one>
    CHAINCODEID_ACCOUNTS_FUNC: "listAccounts",
    CHAINCODEID_TRANSACTIONS: "TransactionManagement", //Taken From The Properties File - Differs from the login and accounts one
    CHAINCODEID_TRANSACTIONS_FUNC: "listTransactions",
    CHAINCODEID_PERMISSIONS: "TransactionManagement",
    CHAINCODEID_PERMISSIONS_FUNC: "checkPermissions",
    LOCALSTORAGE_USER: "hl_user",
    LOCALSTORAGE_USER_ACCOUNTS: "_accounts",
    LOCALSTORAGE_USER_ACCOUNT_SELECTED: "_account_selected",
    LOCALSTORAGE_USER_TRANSACTION_SELECTED: "_transaction_selected",
    ID: 5,
    TYPE: 1,
    QUERY_FAILURE: "Query failure",
    GENERIC_ERROR: "Chaincode invocation failed, contact your system administrator."
  })



