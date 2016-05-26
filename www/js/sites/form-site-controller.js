angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$ionicTabsDelegate", "WeeksService",
                "PlacesService", "ENDPOINT", "LayersService", "FieldsService", "SiteService",
                "SiteSQLiteService", "CameraService", "moment", "CalculationService",
                "ValidationService", "PopupService" , "MembershipsService", "$ionicScrollDelegate",
                "$timeout", "$ionicHistory", "LayersOfflineService", "SessionsService",
                "FieldsOfflineService", "MembershipsOfflineService", "PlacesOfflineService",
                "SwitchTabHelper", "MembershipsHelper", "LayersHelperService", "ParentsOfflineService"]

function FormSiteCtrl($scope, $state, $ionicPopup, $ionicTabsDelegate, WeeksService,
                PlacesService, ENDPOINT, LayersService, FieldsService, SiteService,
                SiteSQLiteService, CameraService, moment, CalculationService,
                ValidationService, PopupService, MembershipsService, $ionicScrollDelegate,
                $timeout, $ionicHistory, LayersOfflineService, SessionsService,FieldsOfflineService,
                MembershipsOfflineService, PlacesOfflineService, SwitchTabHelper,
                MembershipsHelper, LayersHelperService, ParentsOfflineService) {

  var vm = $scope, currentPhotoFieldId, isSubmit = false;
  vm.site = {properties : {}, id:'', files: {}};
  vm.propertiesDate = {};
  vm.fields = [];
  vm.isUpdateSite = false;
  vm.isSiteInServer = false;
  vm.imagesMimeData = {};
  vm.isLastTab = isLastTab;
  vm.currentLayerId;
  vm.districtName = "";
  vm.renderForm = renderForm;
  vm.renderFieldsByLayerId = renderFieldsByLayerId;
  vm.saveSite = saveSite;
  vm.showChoiceCameraPopup = showChoiceCameraPopup;
  vm.getPhoto = getPhoto;
  vm.villageName = PlacesService.getSelectedPlace().name;
  vm.prepareCalculationFields = prepareCalculationFields;
  vm.dependFields = {};
  vm.customValidate = customValidate;
  vm.layers = [];
  vm.layerMembership = {};
  vm.canUpdateSiteOnline = false;
  vm.canReadOnlyLayer = false;
  vm.canReadOnlySite = false;
  vm.selectedYear = WeeksService.getSelectedYear();
  vm.selectedWeek = WeeksService.getSelectedWeek();
  vm.goNext = SwitchTabHelper.goNext;
  vm.goForward = SwitchTabHelper.goForward;
  vm.goPrevious = SwitchTabHelper.goPrevious;
  vm.layersWithInvalidData;
  vm.goBackAndSaveIfData = goBackAndSaveIfData;
  vm.isSubmit = function () {
    isSubmit = true;
  }

  function renderForm() {
    getDistrictName();
    isOnline() ? renderFormOnline() : renderFormOffline();
  }

  function renderFormOnline() {
    vm.showSpinner('templates/loading/loading.html');
    LayersService.fetch().then(function(builtLayers){
      LayersHelperService.removeLayersFields();
      LayersHelperService.storeLayersFields(builtLayers);
      setLayers(builtLayers);
      setCurrentLayerId(builtLayers);
      MembershipsService.fetch().then(function(membership) {
        MembershipsHelper.setLayersMembership(membership);
        MembershipsHelper.handleStoreMembership(membership);
        var builtFields = builtLayers.length > 0 ? LayersService.getBuiltFieldsByLayerId(builtLayers[0].layer_id) : [];
        renderFormSiteInDbOrServer(builtFields);
      }, function() {
        alert('Cannot get data from server.');
      });
    }, function(error){
      vm.hideSpinner();
      PopupService.alertPopup('form.cannot_get_data_from_server', 'form.please_check_internet_connection')
    });
  }

  function renderFormOffline() {
    var userId = SessionsService.getUserId();
    LayersOfflineService.getByUserId(userId).then(function(layers) {
      if(layers.length == 0){
        PopupService.alertPopup("form.no_data_found_in_database", 'form.turn_on_your_internet_connection_to_get_data_from_server');
      }
      angular.forEach(layers, function(layer){
        FieldsOfflineService.getByLayerId(layer.layer_id).then(function(fields) {
          layer.fields = fields;
        });
      });
      LayersOfflineService.setBuildLayers(layers);
      setLayers(layers);
      setCurrentLayerId(layers);
      MembershipsOfflineService.getByUserId(userId).then(function(membership){
        MembershipsHelper.setLayersMembership(membership.item(0));
        MembershipsService.setMemberships(membership.item(0));
        renderFormSiteInDbOrServer(layers[0].fields);
      });
    });
  }


  function setCanReadonlyLayer() {
    membership = MembershipsService.getMemberships();
    if(angular.isString(membership.layers))
      layersMembership = angular.fromJson(membership.layers);
    else
      layersMembership = membership.layers;
    angular.forEach(layersMembership, function(layerMembership){
      if(vm.currentLayerId == layerMembership.layer_id){
        vm.canReadOnlyLayer = !layerMembership.create
                          || (vm.isSiteInServer && !layerMembership.write);
      }
    })
  }

  function setLayers(layers) {
    vm.layers = layers;
  }

  function setCurrentLayerId(layers) {
    if(layers.length > 0){
      $timeout(function(){
        $ionicTabsDelegate.select(0);
      },1);
      vm.currentLayerId = layers[0].layer_id ;
    }
  }

  function renderFormSiteInDbOrServer(builtFields) {
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
        vm.fields = builtFields;
        setDependentFields(vm.fields);
        setCanReadonlyLayer();
        vm.canReadOnlySite = !MembershipsService.canCreate();
      }else{
        isOnline() ? renderFormSiteInServerOrCreate(builtFields) : renderFormCreate(builtFields);
      }
    });
  }

  function renderFormCreate(builtFields) {
    vm.fields = builtFields;
    setCanReadonlyLayer();
    vm.canReadOnlySite = !MembershipsService.canCreate();
    renderFormRememberLastInput(builtFields);
    setDependentFields(builtFields);
  }

  function renderFormSiteInServerOrCreate(builtFields) {
    var week = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
    var placeId = PlacesService.getSelectedPlaceId();
    SiteService.fetchSiteByWeekYearPlaceId(week, year, placeId).then(function (site) {
      vm.hideSpinner();
      vm.isUpdateSite = false;
      if(site){
        vm.canUpdateSiteOnline = MembershipsService.canUpdate();
        vm.isSiteInServer = true;
        prepareFormRender(site, vm.isSiteInServer);
      }else{
        renderFormRememberLastInput(builtFields);
        setDependentFields(builtFields);
      }
      setCanReadonlyLayer();
      vm.canReadOnlySite = !MembershipsService.canCreate();
      vm.fields = builtFields;
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

  function renderFormRememberLastInput(builtFields) {
    angular.forEach(builtFields, function (field) {
      if(field.remember_last_input){
        if(!vm.site.properties[field.field_id]){
          if(angular.isObject(field.default_value)){
            vm.site.properties[field.field_id] = field.default_value[field.field_id];
          }else{
            vm.site.properties[field.field_id] = field.default_value ? field.default_value : "";
          }
        }
      }
    });
  }

  function renderFieldsByLayerId(layerId){
    vm.fields = [];
    $ionicScrollDelegate.scrollTop(true);
    vm.currentLayerId = layerId;
    $timeout(function() {
      if(isOnline()){
        vm.fields = LayersService.getBuiltFieldsByLayerId(layerId);
        setCanReadonlyLayer();
        renderFormRememberLastInput(vm.fields);
        setDependentFields(vm.fields);
      }else{
        FieldsOfflineService.getByLayerId(layerId).then(function(res){
          vm.fields = res;
          setCanReadonlyLayer();
          renderFormRememberLastInput(vm.fields);
          setDependentFields(vm.fields);
        });
      }
    }, 20);
  }

  function isLastTab() {
    if(vm.layers.length > 0)
      return vm.currentLayerId == vm.layers[vm.layers.length - 1].layer_id;
  }

  function prepareCalculationFields() {
    angular.forEach(vm.layers, function (layer) {
      angular.forEach(layer.fields, function (field) {
        if(field.kind == 'calculation'){
          var calSyn = CalculationService.generateSyntax(field);
          vm.site.properties[field.field_id] = vm.$eval(calSyn);
        }
      });
    });
  }

  function setDependentFields(builtFields) {
    angular.forEach(builtFields, function (field) {
      if(field.kind == 'calculation'){
        var dependFields = CalculationService.getDependentFields(field);
        angular.forEach(dependFields, function (dependField) {
          vm.dependFields[dependField.id] = true;
        });
      }
    });
  }

  function addOrUpdateSite(site, propertiesDate) {
    angular.forEach(propertiesDate, function (date, key) {
      site.properties[key] = new moment(date).isValid()? new moment(date).format('MM/DD/YYYY') : ""
    });
    if(vm.canUpdateSiteOnline){
      SiteService.updateSite(site);
    }else{
      if(vm.isUpdateSite){
        SiteSQLiteService.updateSite(site, vm.site.id);
      }
      else{
        SiteSQLiteService.insertSite(site);
      }
    }
  }

  function saveSite(site, propertiesDate) {
    vm.layersWithInvalidData = ValidationService.getLayersWithInvalidData(site);
    if (vm.layersWithInvalidData.length == 0) {
      addOrUpdateSite(site, propertiesDate);
      $state.go('places');
    } else {
      $ionicPopup.alert({
        title: 'Error sending data!',
        scope: vm,
        templateUrl: 'templates/validation/save-site.html',
        okType: 'default-button'
      });
    }
  }

  function customValidate() {
    return isSubmit == false;
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
    var place = PlacesService.getSelectedPlace();
    if(place.ancestry){
      var splitParents = place.ancestry.split("/");
      ParentsOfflineService.getByParentId(splitParents[splitParents.length-1]).then(function(parent){
        vm.districtName = parent.length > 0 ? parent.item(0).name : "";
      })
    }
  }

  function goBackAndSaveIfData() {
    $ionicHistory.goBack();
    if(vm.site.properties && !vm.canUpdateSiteOnline
      && !vm.isSiteInServer && vm.layers.length != 0 && !vm.canReadOnlySite)
      addOrUpdateSite(vm.site, vm.propertiesDate);
  }
}
