angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$ionicTabsDelegate", "WeeksService",
                "PlacesService", "ENDPOINT", "LayersService", "FieldsService", "SiteService",
                "SiteSQLiteService", "CameraService", "moment", "CalculationService",
                "ValidationService", "PopupService" , "MembershipsService", "$ionicScrollDelegate",
                "$timeout", "$ionicHistory", "LayersOfflineService", "SessionsService",
                "FieldsOfflineService", "MembershipsOfflineService", "PlacesOfflineService"]

function FormSiteCtrl($scope, $state, $ionicPopup, $ionicTabsDelegate, WeeksService,
                PlacesService, ENDPOINT, LayersService, FieldsService, SiteService,
                SiteSQLiteService, CameraService, moment, CalculationService,
                ValidationService, PopupService, MembershipsService, $ionicScrollDelegate,
                $timeout, $ionicHistory, LayersOfflineService, SessionsService,FieldsOfflineService,
                MembershipsOfflineService, PlacesOfflineService) {

  var vm = $scope, currentPhotoFieldId, isSubmit, layersMembership;
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
  vm.renderFieldsForm = renderFieldsForm;
  vm.saveSite = saveSite;
  vm.showChoiceCameraPopup = showChoiceCameraPopup;
  vm.getPhoto = getPhoto;
  vm.villageName = PlacesService.getSelectedPlace().name;
  vm.prepareCalculationFields = prepareCalculationFields;
  vm.dependFields = {};
  vm.customValidate = customValidate;
  vm.layers;
  vm.layerMembership = {};
  vm.canUpdateSiteOnline = false;
  vm.canReadOnlyLayer = false;
  vm.selectedYear = WeeksService.getSelectedYear();
  vm.selectedWeek = WeeksService.getSelectedWeek();
  vm.goNext = goNext;
  vm.goForward = goForward;
  vm.goPrevious = goPrevious;
  vm.layersWithInvalidData;
  vm.goBackAndSaveIfData = goBackAndSaveIfData;
  vm.isSubmit = function () {
    isSubmit = true;
  }

  function setCanReadonlyLayer(layersMembership) {
    angular.forEach(layersMembership, function(layerMembership){
      if(vm.currentLayerId == layerMembership.layer_id){
        vm.canReadOnlyLayer = (!vm.isUpdateSite && !layerMembership.create)
                          || (vm.isSiteInServer && !layerMembership.write);
      }
    })
  }

  function setLayerMembership(membership) {
    if(angular.isString(membership.layers))
      layersMembership = angular.fromJson(membership.layers);
    else
      layersMembership = membership.layers
  }

  function setLayers(layers) {
    vm.layers = layers;
  }

  function setCurrentLayerId(layers, isFromServer) {
    if(layers.length > 0){
      $timeout(function(){
        $ionicTabsDelegate.select(0);
      },1);
      console.log('layer : ', layers);
      vm.currentLayerId = isFromServer? layers[0].id : layers[0].layer_id ;
      console.log('vm.currentLayerId set : ', vm.currentLayerId);
    }
  }


  function renderForm() {
    if(isOnline()){
      renderFormOnline();
    }else{
      renderFormOffline()
    }
  }

  function renderFormOnline() {
    vm.showSpinner('templates/loading/loading.html');
    getDistrictName();
    LayersService.fetch().then(function(builtLayers){
      console.log('builtLayers : ', builtLayers);
      handleStoreLayersFields(builtLayers);
      setLayers(builtLayers);
      setCurrentLayerId(builtLayers, true);
      MembershipsService.fetch().then(function(membership) {
        setLayerMembership(membership);
        handleStoreMembership(membership);
        renderFormSiteInDbOrServer();
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
      setCurrentLayerId(layers, false);
      console.log('layers : ',layers);
      MembershipsOfflineService.getByUserId(userId).then(function(membership){
        console.log('membership : ', membership.item(0));
        setLayerMembership(membership.item(0));
        // renderFormSiteInDbOrServer();
        console.log('vm.currentLayerId    : ', vm.currentLayerId);
        FieldsOfflineService.getByLayerId(vm.currentLayerId).then(function(res){
          console.log('res : ', res);
          vm.fields = res;
        });
      })
    });
  }

  function handleStoreMembership(membership) {
    MembershipsOfflineService.getByUserId(membership.user_id).then(function(res){
      res.length>0 ? MembershipsOfflineService.update(membership):MembershipsOfflineService.insert(membership);
    })
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
    LayersOfflineService.getByUserIdPlaceIdLayerId(userId, placeId, layer.id).then(function(res) {
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
      FieldsOfflineService.getByLayerIdFieldId(layer.id, field.id).then(function(res){
        res.length > 0 ? FieldsOfflineService.update(field, layer.id) : FieldsOfflineService.insert(field, layer.id);
      });
    });
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
        setDependentFields(vm.fields);
        setCanReadonlyLayer(layersMembership);
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
        vm.canUpdateSiteOnline = MembershipsService.canUpdate();
        vm.isSiteInServer = true;
        prepareFormRender(site, vm.isSiteInServer);
      }else{
        renderFormRememberLastInput(builtFields);
        setDependentFields(builtFields);
      }
      setCanReadonlyLayer(layersMembership)
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

  function renderFormRememberLastInput(builtFields) {
    angular.forEach(builtFields, function (field) {
      if(field.remember_last_input){
        if(!vm.site.properties[field.id]){
          if(angular.isObject(field.default_value)){
            vm.site.properties[field.id] = field.default_value[field.id];
          }else{
            vm.site.properties[field.id] = field.default_value;
          }
        }
      }
    });
  }

  function renderFieldsForm(layerId){
    vm.fields = [];
    $ionicScrollDelegate.scrollTop(true);
    vm.currentLayerId = layerId;
    $timeout(function() {
      vm.fields = LayersService.getBuiltFieldsByLayerId(layerId);
      setCanReadonlyLayer(layersMembership);
      renderFormRememberLastInput(vm.fields);
      setDependentFields(vm.fields);
    }, 20);
  }

  function isLastTab() {
    return vm.currentLayerId == LayersService.getLastLayerId()
  }

  function prepareCalculationFields() {
    angular.forEach(vm.layers, function (layer) {
      angular.forEach(layer.fields, function (field) {
        if(field.kind == 'calculation'){
          var calSyn = CalculationService.generateSyntax(field);
          vm.site.properties[field.id] = vm.$eval(calSyn);
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

  function goNext() {
    $timeout(function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      $ionicTabsDelegate.select(selected + 1);
    }, 10);
  }

  function goForward() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) {
      $ionicTabsDelegate.select(selected + 1);
    }
  }

  function goPrevious() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1 && selected != 0) {
      $ionicTabsDelegate.select(selected - 1);
    }
  }

  function goBackAndSaveIfData() {
    $ionicHistory.goBack();
    if(vm.site.properties && !vm.canUpdateSiteOnline)
      addOrUpdateSite(vm.site, vm.propertiesDate);
  }
}
