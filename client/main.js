angular.module('test', []).controller('MainController', function($scope, $q, $http, $timeout, $rootScope){
  $scope.exceptionMode = "0";

  $scope.nativeError = function(){
    setTimeout(function(){
      throw new Error("Native Error thrown: " + Date.now());
    }, 500);
  }
  $scope.throwError = function(){
    throw new Error("Synchronous Error thrown: " + Date.now());
  }
  $scope.throwAngularjsTimeoutError = function(){
    $timeout(function(){
      throw new Error('Timeout Error thrown: ' + Date.now());
    }, 500);
  }
  $scope.throw404HttpError = function(){
    $http.get('/url/that/shouldnt/exist');
  }

  $scope.throw500HttpError = function(){
    $http.post('/url/that/should/500');
  }

  $scope.rejectPromise = function(){
    var deferred = $q.defer();
    deferred.reject('Promise rejection: ' + Date.now());
  }

  $scope.catchThrownPromise = function(){
    var deferred = $q.defer();
    deferred.promise.then(function(){
      throw new Error('Caught promise thrown: ' + Date.now());
    }).then(null, function(err){
      console.log('This should only show up if a promise was caught properly');
      return 'foo';
    });

    deferred.resolve();
  }

  $scope.$watch('exceptionMode', function(value){
    $rootScope.exceptionMode = value;
  });

}).config(function($provide){
  $provide.decorator('$exceptionHandler', function($delegate, $injector){
    return function(exception){
      var $rootScope = $injector.get('$rootScope');
      switch($rootScope.exceptionMode){
        case "0":
          throw exception;
        case "1":
        default:
          setTimeout(function(){
            throw exception;
          }, 0);
      }
      return $delegate.apply(this, arguments);
    }
  });
});