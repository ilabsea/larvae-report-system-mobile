angular.module('app')
.controller('PlacesCtrl', PlacesCtrl)

PlacesCtrl.$inject = ["$scope", "WeeksService", "$ionicPopup",
      "$state", "$ionicHistory", "PlacesService", "SiteService", "SiteSQLiteService",
      "ApiService", "SessionsService", "PlacesOfflineService", "PopupService", "$timeout",
      "$ionicListDelegate"]

function PlacesCtrl($scope, WeeksService, $ionicPopup, $state, $ionicHistory,
    PlacesService, SiteService, SiteSQLiteService, ApiService, SessionsService,
    PlacesOfflineService, PopupService, $timeout, $ionicListDelegate) {

  var vm = $scope;
  vm.getPlaces = getPlaces;
  vm.selectedYear = WeeksService.getSelectedYear();
  vm.selectedWeek = WeeksService.getSelectedWeek();
  vm.uploadSites = uploadSites;
  vm.setPlace = setSelectedPlace;
  vm.numberOfSites = 0;
  vm.goBack = goBack;
  vm.deleteReport = deleteReport;

  function setNumberOfSitesInWeekYear() {
    SiteSQLiteService.getNumberOfSitesInWeekYear().then(function(l){
      vm.numberOfSites = l.number_sites;
    })
  }

  function getPlaces() {
    isOnline() ? getPlacesOnline() : getPlacesOffline();
  }

  function getPlacesOnline() {
    vm.showSpinner('templates/loading/loading.html');
    PlacesService.fetch().then(function (places) {
      vm.hideSpinner();
      removePlacesByUserId(userId);
      angular.forEach(places, function(place){
        place.place_id = place.id;
        storePlace(place);
        generateIconInPlace(places, place);
      });
    }, function(err) {
      if(!SessionsService.getAuthToken()){
        vm.isErrorAuthToken = true;
        $state.go('login');
      }
    });
  }

  function getPlacesOffline() {
    PlacesOfflineService.getByUserId(SessionsService.getUserId()).then(function(places) {
      vm.places = generateClassInPlaces(places);
    });
  }

  function generateIconInPlace(places, place) {
    SiteService.fetchSiteByWeekYearPlaceId(vm.selectedWeek, vm.selectedYear, place.place_id)
      .then(function(site){
        if(site){
          place.siteOnServer = true;
          vm.places = places;
        }else
          vm.places = generateClassInPlaces(places);
    });
  }

  function removePlacesByUserId(uId) {
    PlacesOfflineService.deleteByUserId(uId);
  }

  function storePlace(place) {
    PlacesService.fetchPlaceParent(place).then(function(parent){
      PlacesOfflineService.insert(place, parent);
    });
  }

  function generateClassInPlaces(places){
    angular.forEach(places, function(place){
      SiteSQLiteService.getSiteByPlaceIdInWeekYear(place.place_id).then(function(site){
        place.hasData = site.length > 0 ;
      })
    });
    return places;
  }

  function uploadSites(){
    if(isOnline()){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Upload Sites to malaria station',
        template: 'Are you sure to send all reports to malaria station with total of '
                    + vm.numberOfSites + ' villages?',
        cssClass: 'custom-class',
        cancelText: 'No',
        okText: 'Yes',
        okType: 'default-button'
      });
      confirmPopup.then(function (res) {
        if(res){
          vm.showSpinner('templates/loading/loading.html');
          SiteSQLiteService.uploadSites(vm.selectedWeek, vm.selectedYear);
        }
      });
    }else{
      PopupService.alertPopup("place.error", "place.please_check_your_internet_connection");
    }
  }

  function setSelectedPlace(place) {
    PlacesService.setSelectedPlaceId(place.place_id);
    PlacesService.setSelectedPlace(place);
  }

  function goBack() {
    $ionicHistory.goBack();
  }

  function deleteReport(place) {
    PopupService.confirmPopup('place.delete_report',
      'place.are_you_sure_you_want_to_delete_report_in' , place.name + "?" , function(res ){
        SiteSQLiteService.deleteSiteByPlaceWeekYear(place.id);
        $state.go($state.current, {}, {reload: true});
        $ionicListDelegate.closeOptionButtons();
    }, function(){
      $ionicListDelegate.closeOptionButtons();
    });
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.url== "/places") {console.log('here');
      vm.places = generateClassInPlaces(vm.places);
      setNumberOfSitesInWeekYear();
      $ionicListDelegate.closeOptionButtons();
    }
  });
}
