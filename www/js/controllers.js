angular.module('app')

.controller('AppCtrl', function($translate, $scope) {
  var vm = $scope;
  vm.selectLanguage = function(language) {
    $translate.use(language);
  }
})
