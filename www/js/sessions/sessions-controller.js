angular.module('app')

.controller('SessionsCtrl', function($scope, $state, $ionicPopup, SessionsService) {
  $scope.user = {"email": 'mouyleng+1@instedd.org', "password" : 'mouyleng123'};

  $scope.login = function(user) {
    SessionsService.login(user).then(function(authenticated) {
      $state.go("weeks-calendar");
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Invalid Email or Password.'
      });
    });
  };

  $scope.logout = function() {
    SessionsService.logout();
    $state.go("login");
  };
})
