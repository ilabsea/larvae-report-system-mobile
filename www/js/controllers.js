angular.module('app')

.controller('AppCtrl', function($translate, $scope, $filter) {
  $translate.use("lao");
})
