angular.module('app')

.controller('AppCtrl', function($translate, $scope, $filter) {
  $translate.use("lao");
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.user = {"email": 'mouyleng@instedd.org', "password" : 'leng12'};

  $scope.login = function(user) {
    AuthService.login(user).then(function(authenticated) {
      // $state.go("weekly");
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Invalid Email or Password.'
      });
    });
  };
})
