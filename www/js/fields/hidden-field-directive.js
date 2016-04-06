angular.module('app')
.directive('hiddenInputValidation', function () {
  return {
    restrict: 'A',
    scope: false,
    require: 'ngModel',
    link: function($scope, element, attrs, ctrl){
      isRequired = attrs.isRequired === 'false' ? false : true;
      $scope.$watch(attrs.ngModel, function(value){
        isRequired = attrs.isRequired === 'true' ? true : false;
        if(!isRequired){
          ctrl.$setValidity('customValidate', true);
        }
        else{
          if(angular.isUndefined(value) || value)
            ctrl.$setValidity('customValidate', true);
          else
            ctrl.$setValidity('customValidate', false);
        }
      });
    }
  }
});
