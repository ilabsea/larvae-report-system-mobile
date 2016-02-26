angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "$ionicPopup", "SessionsService"]

function SessionsCtrl($scope, $state, $ionicPopup, SessionsService) {
  var vm = $scope, loadingSpinner;
  vm.user = {'email': 'mouyleng+4@instedd.org', 'password':'mouyleng123'};
  // vm.user = {};
  vm.login = login;
  vm.logout = logout;


  function login(user) {
    vm.showSpinner('templates/partials/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      vm.hideSpinner();
      $state.go("weeks-calendar");
    }, function(err) {
      vm.hideSpinner();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Invalid Email or Password.',
        okType: 'default-button'
      });

      alertPopup.then(function() {
        alertPopup.close();
      });
    });
  };

  function logout() {
    SessionsService.logout();
    $state.go("login");
  };
}
