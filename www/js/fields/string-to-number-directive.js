angular.module('app')

.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return parseFloat(value, 10);
      });

      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
});
