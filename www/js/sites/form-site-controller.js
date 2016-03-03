angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$ionicHistory", "ApiService", "WeeksService",
                "PlacesService", "ENDPOINT", "LayersService", "FieldsService", "SiteService",
                "SiteSQLiteService", "CameraService", "moment", "ApiService"]

function FormSiteCtrl($scope, $state, $ionicPopup, $ionicHistory, ApiService, WeeksService,
                PlacesService, ENDPOINT, LayersService, FieldsService, SiteService,
                SiteSQLiteService, CameraService, moment, ApiService) {
  var vm = $scope, currentPhotoFieldId;
  vm.site = {properties : {}, id:'', files: {}};
  vm.propertiesDate = {};
  vm.fields = [];
  vm.isUpdateSite = false;
  vm.isSiteInServer = false;
  vm.imagesMimeData = {};
  vm.activeTab;
  vm.districtName = "";
  vm.renderForm = renderForm;
  vm.renderFieldsForm = renderFieldsForm;
  vm.saveSite = saveSite;
  vm.showChoiceCameraPopup = showChoiceCameraPopup;
  vm.getPhoto = getPhoto;
  vm.backToPlace = backToPlace;
  vm.villageName = PlacesService.getSelectedPlace().name;

  function renderForm() {
    vm.showSpinner('templates/partials/loading.html');
    getDistrictName();
    LayersService.fetch().then(function(builtLayers){
      vm.layers = builtLayers;
      vm.activeTab = builtLayers.length > 0 ? builtLayers[0].id : '';
      renderFormSiteInDbOrServer();
    }, function(error){
      vm.hideSpinner();
      $ionicPopup.alert({
        title: 'Fetch data failed',
        template: 'Please try aggain!'
      });
    })
  }

  function renderFormSiteInDbOrServer() {
    var placeId = PlacesService.getSelectedPlaceId();
    SiteSQLiteService.getSiteByPlaceIdInWeekYear(placeId).then(function(site){
      vm.hideSpinner();
      if(site.length > 0){
        vm.isUpdateSite = true;
        vm.isSiteInServer = false;
        vm.site.id = site[0].id;
        var siteData = {"properties" : angular.fromJson(site[0].properties),
                        "files" : angular.fromJson(site[0].files)}
        prepareFormRender(siteData, vm.isSiteInServer);
        vm.fields = vm.layers.length > 0 ? LayersService.getBuiltFieldsByLayerId(vm.layers[0].id) : [];
      }else{
        renderFormSiteInServer();
      }
    });
  }

  function renderFormSiteInServer() {
    var week = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
    var placeId = PlacesService.getSelectedPlaceId();
    SiteService.fetchSiteByWeekYearPlaceId(week, year, placeId).then(function (site) {
      vm.hideSpinner();
      vm.isUpdateSite = false;
      var builtFields = LayersService.getBuiltFieldsByLayerId(vm.layers[0].id)
      if(site){
        vm.isSiteInServer = true;
        prepareFormRender(site, vm.isSiteInServer);
      }else{
        angular.forEach(builtFields, function (field) {
          if(field.remember_last_input)
            vm.site.properties[field.id] = field.default_value;
        });
      }
      vm.fields = vm.layers.length > 0 ? builtFields : [];
    });
  }

  function prepareFormRender(site, fromServer) {
    vm.site.properties = site.properties;
    var dateFieldsId = FieldsService.getDateFieldsId();
    var photoFieldsId = FieldsService.getPhotoFieldsid()
    angular.forEach(dateFieldsId, function(id) {
      vm.propertiesDate[id] = new Date(site.properties[id]);
    });
    angular.forEach(photoFieldsId, function(id) {
      if(fromServer){
        vm.site.files = site.properties[id];
        if(vm.site.files)
          vm.imagesMimeData[id] = ENDPOINT.photo_path + site.properties[id];
      }else {
        var propertiesPhoto = site.properties[id] ;
        vm.site.files = site.files;
        var imageURI = vm.site.files[propertiesPhoto];
        if(imageURI)
          vm.imagesMimeData[id] = "data:image/jpeg;base64," + imageURI;
      }
    });
  }

  function renderFieldsForm(layerId){
    vm.activeTab = layerId;
    vm.fields = LayersService.getBuiltFieldsByLayerId(layerId);
    if(layerId == LayersService.getLastLayerId())
      vm.isLastTab = true;
    else
      vm.isLastTab = false;
  }

  function saveSite(site, propertiesDate) {
    angular.forEach(propertiesDate, function (date, key) {
      site.properties[key] = new moment(date).isValid()? new moment(date).format('MM/DD/YYYY') : ""
    });
    if(vm.isUpdateSite)
      SiteSQLiteService.updateSite(site, vm.site.id);
    else
      SiteSQLiteService.insertSite(site);
    $state.go('places');
    vm.fields = [];
  }
  var CameraOptionsPopup;

  function showChoiceCameraPopup(photoFieldId){
    CameraOptionsPopup = $ionicPopup.show({
      templateUrl: "templates/camera-options.html",
      title: 'Photo options',
      scope: $scope,
      buttons: [{ text: 'Cancel' }]
    });
    currentPhotoFieldId = photoFieldId;
  }

  function getPhoto(value) {
    var type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    if(value == "CAMERA")
      type = Camera.PictureSourceType.CAMERA;

    CameraService.getPicture().then(function(imageURI) {
      var timeStampMoment = new moment().valueOf();
      fileName = timeStampMoment + "_" + currentPhotoFieldId +  ".jpg";
      vm.site.properties[currentPhotoFieldId]  = fileName;
      vm.site.files[fileName] = imageURI;
      vm.imagesMimeData[currentPhotoFieldId] = "data:image/jpeg;base64," + imageURI;
      CameraOptionsPopup.close();
    }, function(err) {
      console.err(err);
    });
  }

  function getDistrictName() {
    PlacesService.fetchPlaceParent().then(function(place) {
      vm.districtName = place ? place.name : "";
    });
  }

  function backToPlace(){
    $ionicHistory.goBack();
  }
}
