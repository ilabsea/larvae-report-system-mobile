angular.module('app')

.controller('AppCtrl', function($translate, $scope) {
  var vm = $scope;
  console.log('app controller');
  vm.selectLanguage = function(language) {
    $translate.use(language);
  }
})
