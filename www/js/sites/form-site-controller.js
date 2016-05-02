angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$ionicTabsDelegate", "WeeksService",
                "PlacesService", "ENDPOINT", "LayersService", "FieldsService", "SiteService",
                "SiteSQLiteService", "CameraService", "moment", "CalculationService",
                "ValidationService", "PopupService" , "MembershipsService", "$ionicScrollDelegate",
                "$timeout", "$ionicHistory", "LayersOfflineService", "SessionsService",
                "FieldsOfflineService", "MembershipsOfflineService", "PlacesOfflineService",
                "SwitchTabHelper", "MembershipsHelper"]

function FormSiteCtrl($scope, $state, $ionicPopup, $ionicTabsDelegate, WeeksService,
                PlacesService, ENDPOINT, LayersService, FieldsService, SiteService,
                SiteSQLiteService, CameraService, moment, CalculationService,
                ValidationService, PopupService, MembershipsService, $ionicScrollDelegate,
                $timeout, $ionicHistory, LayersOfflineService, SessionsService,FieldsOfflineService,
                MembershipsOfflineService, PlacesOfflineService, SwitchTabHelper,
                MembershipsHelper) {

  var vm = $scope, currentPhotoFieldId, isSubmit;
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
    isOnline() ? renderFormOnline() : renderFormOffline();
  }

  function renderFormOnline() {
    vm.showSpinner('templates/loading/loading.html');
    getDistrictName();
    LayersService.fetch().then(function(builtLayers){
      handleStoreLayersFields(builtLayers);
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
    getDistrictName();
    var userId = SessionsService.getUserId();
    var placeId = PlacesService.getSelectedPlaceId();
    LayersOfflineService.getByUserIdPlaceId(userId, placeId).then(function(layers) {
      setLayers(layers);
      setCurrentLayerId(layers);
      MembershipsOfflineService.getByUserId(userId).then(function(membership){
        MembershipsHelper.setLayersMembership(membership.item(0));
      })
    });
  }

  function setCanReadonlyLayer() {
    layersMembership = MembershipsHelper.getLayersMembership();
    angular.forEach(layersMembership, function(layerMembership){
      if(vm.currentLayerId == layerMembership.layer_id){
        vm.canReadOnlyLayer = (!vm.isUpdateSite && !layerMembership.create)
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

  function handleStoreLayersFields(builtLayers) {
    var userId = SessionsService.getUserId();
    var placeId = PlacesService.getSelectedPlaceId();
    angular.forEach(builtLayers, function(layer) {
      handleStoreLayer(layer, userId, placeId);
      handleStoreFields(layer);
    })
  }

  function handleStoreLayer(layer, userId, placeId) {
    LayersOfflineService.getByUserIdPlaceIdLayerId(userId, placeId, layer.layer_id).then(function(res) {
      if(res.length > 0){
        if(res.item(0).name != layer.name)
          LayersOfflineService.update(layer);
      } else{
        LayersOfflineService.insert(layer);
      }
    })
  }

  function handleStoreFields(layer) {
    angular.forEach(layer.fields, function(field){
      FieldsOfflineService.getByLayerIdFieldId(layer.layer_id, field.field_id).then(function(res){
        if(res.length > 0) FieldsOfflineService.update(field, layer.layer_id)
        else FieldsOfflineService.insert(field, layer.layer_id);
      });
    });
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
      }else{
        if(isOnline()) {
          renderFormSiteInServerOrCreate(builtFields);
        } else {
          renderFormRememberLastInput(builtFields);
          setDependentFields(builtFields);
          setCanReadonlyLayer();
          vm.fields = builtFields;
        }
      }
    });
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
      setCanReadonlyLayer()
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
          renderFormSiteInDbOrServer(res);
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
      if(vm.isUpdateSite)
        SiteSQLiteService.updateSite(site, vm.site.id);
      else
        SiteSQLiteService.insertSite(site);
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

  function customValidate(fieldId) {
    value = vm.site.properties[fieldId];
    return angular.isUndefined(value) && !isSubmit;
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
    var placeId = PlacesService.getSelectedPlaceId();
    PlacesOfflineService.getByPlaceId(placeId).then(function(place){
      vm.districtName = place.length > 0 ? place.item(0).parent_place_name : "";
    });
  }

  function goBackAndSaveIfData() {
    $ionicHistory.goBack();
    if(vm.site.properties && !vm.canUpdateSiteOnline)
      addOrUpdateSite(vm.site, vm.propertiesDate);
  }
}
