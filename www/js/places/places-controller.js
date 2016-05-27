angular.module('app')
.controller('PlacesCtrl', PlacesCtrl)

PlacesCtrl.$inject = ["$scope", "WeeksService", "$state", "$ionicHistory", "PlacesService",
      "SiteService", "SiteSQLiteService", "ApiService", "SessionsService", "PlacesOfflineService",
      "PopupService", "$timeout", "$ionicListDelegate", "LayersOfflineService",
      "FieldsOfflineService", "ParentsOfflineService"]

function PlacesCtrl($scope, WeeksService, $state, $ionicHistory,
    PlacesService, SiteService, SiteSQLiteService, ApiService, SessionsService,
    PlacesOfflineService, PopupService, $timeout, $ionicListDelegate,
    LayersOfflineService, FieldsOfflineService, ParentsOfflineService) {

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
      removeParentsByUserId(userId);
      vm.places = places;
      angular.forEach(vm.places, function(place){
        place.place_id = place.id;
        place.hasData = false;
        storePlace(place);
        storeParent(place.ancestry);
      });
      buildIconSitesInServer(places);
      buildIconSitesInSQLite(places);
    }, function(err) {
      if(!SessionsService.getAuthToken()){
        vm.isErrorAuthToken = true;
        $state.go('login');
      }
    });
  }

  function getPlacesOffline() {
    PlacesOfflineService.getByUserId(SessionsService.getUserId()).then(function(places) {
      vm.places = places;
      buildIconSitesInSQLite(vm.places);
    });
  }

  function buildIconSitesInServer(places) {
    SiteService.fetchSitesByWeekYear(vm.selectedWeek, vm.selectedYear).then(function(sites) {
      var index = 0,
          lsites = sites.length
      for(; index < lsites; index++){
        site = sites[index];
        var j = 0,
            l = places.length
        for(; j < l ; j++){
          place = places[j];
          if(site.place_id == place.place_id){
            place.siteOnServer = true;
            break;
          }
        }
      }
    });
  }

  function buildIconSitesInSQLite(places) {
    SiteSQLiteService.getSitesByWeekYear(vm.selectedWeek, vm.selectedYear).then(function(sites){
      var index = 0,
          lsites = sites.length
      for(; index < lsites; index++){
        site = sites[index];
        var j = 0,
            l = places.length
        for(; j < l ; j++){
          place = places[j];
          if(site.place_id == place.place_id){
            place.hasData = true ;
            place.siteInvalid = false;
            var properties = angular.fromJson(site.properties);
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
            break;
          }
        }
      }
    });
  }

  function removePlacesByUserId(uId) {
    PlacesOfflineService.deleteByUserId(uId);
  }

  function removeParentsByUserId(uId) {
    ParentsOfflineService.deleteByUserId(uId);
  }

  function storePlace(place) {
    PlacesOfflineService.insert(place);
  }

  function storeParent(ancestry) {
    PlacesService.fetchPlaceParent(ancestry).then(function(parent){
      ParentsOfflineService.insert(parent);
    });
  }

  function uploadSites(){
    if(isOnline()){
      PopupService.confirmPopup("place.upload_reports",
          "place.are_you_sure_to_send_all_reports_to_malaria_station_with_total_of", vm.numberOfSites + " villages?" ,
          function(res){
        vm.showSpinner('templates/loading/loading.html');
        SiteSQLiteService.uploadSites(vm.selectedWeek, vm.selectedYear);
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
        place.siteInvalid = false;
        place.hasData = false;
        $state.go($state.current, {}, {reload: true});
        $ionicListDelegate.closeOptionButtons();
    }, function(){
      $ionicListDelegate.closeOptionButtons();
    });
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.url== "/places") {
      if(vm.places){
        buildIconSitesInSQLite(vm.places);
        setNumberOfSitesInWeekYear();
        $ionicListDelegate.closeOptionButtons();
      }
    }
  });
}
