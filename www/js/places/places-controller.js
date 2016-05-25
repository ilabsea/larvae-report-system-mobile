angular.module('app')
.controller('PlacesCtrl', PlacesCtrl)

PlacesCtrl.$inject = ["$scope", "WeeksService", "$ionicPopup",
      "$state", "$ionicHistory", "PlacesService", "SiteService", "SiteSQLiteService",
      "ApiService", "SessionsService", "PlacesOfflineService", "PopupService", "$timeout",
      "$ionicListDelegate", "LayersOfflineService", "FieldsOfflineService"]

function PlacesCtrl($scope, WeeksService, $ionicPopup, $state, $ionicHistory,
    PlacesService, SiteService, SiteSQLiteService, ApiService, SessionsService,
    PlacesOfflineService, PopupService, $timeout, $ionicListDelegate,
    LayersOfflineService, FieldsOfflineService) {

  var vm = $scope, fieldsMandatory = [];
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
    setFieldsMandatory();
    isOnline() ? getPlacesOnline() : getPlacesOffline();
  }

  function setFieldsMandatory() {
    LayersOfflineService.getByUserId(SessionsService.getUserId()).then(function(layers){
      var i = 0,
          l = layers.length
      for(; i < l ; i++){
        layer = layers[i];
        FieldsOfflineService.getByLayerId(layer.layer_id).then(function(fields){
          var j = 0,
              lf = fields.length
          for(; j < lf ; j++){
            field = fields[j];
            if(field.is_mandatory)
              fieldsMandatory.push(field);
          }
        });
      }
    });
  }

  function getPlacesOnline() {
    vm.showSpinner('templates/loading/loading.html');
    PlacesService.fetch().then(function (places) {
      vm.hideSpinner();
      removePlacesByUserId(userId);
      vm.places = places;
      angular.forEach(vm.places, function(place){
        place.place_id = place.id;
        storePlace(place);
        generateIconInPlace(place);
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

  function generateIconInPlace(place) {
    SiteService.fetchSiteByWeekYearPlaceId(vm.selectedWeek, vm.selectedYear, place.place_id)
      .then(function(site){
        if(site){
          place.siteOnServer = true;
        }else
          generateClassInAPlace(place);
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
      generateClassInAPlace(place);
    });
    return places;
  }

  function generateClassInAPlace(place){
    SiteSQLiteService.getSiteByPlaceIdInWeekYear(place.place_id).then(function(site){
      place.hasData = site.length > 0 ;
      place.siteError = false;
      if(site.length > 0){
        var properties = angular.fromJson(site[0].properties);
        place.siteInvalid = false;
        var i = 0;
            l = fieldsMandatory.length
        for(; i < l ; i++){
          fieldMandatory = fieldsMandatory[i];
          value = properties[fieldMandatory.field_id];
          if(angular.isUndefined(value) || value == '' || value == null){
            place.siteInvalid = true;
            break;
          }
        }
      }
    })
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
    if (toState.url== "/places") {
      vm.places = generateClassInPlaces(vm.places);
      setNumberOfSitesInWeekYear();
      $ionicListDelegate.closeOptionButtons();
    }
  });
}
