describe('Weeks calendar', function () {
  var $scope, $state, $filter, weeksCtrl;

  beforeEach(module('app'));

  beforeEach(inject(function ($scope, $state, $filter, $controller) {
    weeksCtrl = $controller(WeeksCalendarCtrl, {
                $scope: $scope
            });

	}));

  it('should have weeks calendar', function(){
    expect(scope.weeks).toEqual(3);
  });
});
