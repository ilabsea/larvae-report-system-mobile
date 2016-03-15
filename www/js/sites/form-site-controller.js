angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$ionicHistory", "WeeksService",
                "PlacesService", "ENDPOINT", "LayersService", "FieldsService", "SiteService",
                "SiteSQLiteService", "CameraService", "moment", "CalculationService",
                "ValidationService", "PopupService" , "MembershipsService"]

function FormSiteCtrl($scope, $state, $ionicPopup, $ionicHistory, WeeksService,
                PlacesService, ENDPOINT, LayersService, FieldsService, SiteService,
                SiteSQLiteService, CameraService, moment, CalculationService,
                ValidationService, PopupService, MembershipsService) {
  var vm = $scope, currentPhotoFieldId, isSubmit, layersMembership;
  vm.site = {properties : {}, id:'', files: {}};
  vm.propertiesDate = {};
  vm.fields = [];
  vm.isUpdateSite = false;
  vm.isSiteInServer = false;
  vm.imagesMimeData = {};
  vm.activeTab;
  vm.isLastTab = isLastTab;
  vm.districtName = "";
  vm.renderForm = renderForm;
  vm.renderFieldsForm = renderFieldsForm;
  vm.saveSite = saveSite;
  vm.showChoiceCameraPopup = showChoiceCameraPopup;
  vm.getPhoto = getPhoto;
  vm.backToPlace = backToPlace;
  vm.villageName = PlacesService.getSelectedPlace().name;
  vm.prepareCalculationFields = prepareCalculationFields;
  vm.dependFields = {};
  vm.customValidate = customValidate;
  vm.layers;
  vm.layerMembership = {};
  vm.canUpdateSiteOnline = false;
  vm.canReadOnlyLayer = false;
  vm.isSubmit = function () {
    isSubmit = true;
  }

  function setCanReadonlyLayer(layersMembership) {
    angular.forEach(layersMembership, function(layerMembership){
      if(vm.activeTab == layerMembership.layer_id){
        vm.canReadOnlyLayer = (!vm.isUpdateSite && !layerMembership.create) || (vm.isSiteInServer && !layerMembership.write);
        console.log('vm.canOnlyReadLayer : ,', (!vm.isUpdateSite && !layerMembership.create));
        console.log('vm.canOnlyReadLayer : ,', (vm.isSiteInServer && !layerMembership.write));
        console.log('vm.isSiteInServer : ', vm.isSiteInServer);
        console.log('vm.canOnlyReadLayer last : ', vm.canReadOnlyLayer);
      }
    })
  }

  function setLayerMembership(membership) {
    layersMembership = membership.layers;
  }

  function setLayers(layers) {
    vm.layers = layers;
  }

  function setActiveTab(layer) {
    vm.activeTab = layer.length > 0 ? layer[0].id : '';
  }

  function renderForm() {
    vm.showSpinner('templates/loading/loading.html');
    getDistrictName();
    LayersService.fetch().then(function(builtLayers){
      setLayers(builtLayers);
      setActiveTab(builtLayers);
      MembershipsService.fetch().then(function(membership) {
        setLayerMembership(membership);
        renderFormSiteInDbOrServer();
      }, function() {
        alert('Cannot get data from server.');
      });
    }, function(error){
      vm.hideSpinner();
      PopupService.alertPopup('form.cannot_get_data_from_server', 'form.please_check_internet_connection')
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
    vm.activeTab = layerId;
    vm.fields = LayersService.getBuiltFieldsByLayerId(layerId);
    setCanReadonlyLayer(layersMembership);
    renderFormRememberLastInput(vm.fields);
    setDependentFields(vm.fields);
  }

  function isLastTab() {
    return vm.activeTab == LayersService.getLastLayerId()
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

  function addOrUpdateSite(site) {
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
    angular.forEach(propertiesDate, function (date, key) {
      site.properties[key] = new moment(date).isValid()? new moment(date).format('MM/DD/YYYY') : ""
    });
    var layerWithInvalidData = ValidationService.getLayersWithInvalidData(site);
    if(layerWithInvalidData.length == 0){
      addOrUpdateSite(site);
      $state.go('places');
    }else{
      $ionicPopup.alert({
        title: 'Invalid data',
        template: 'Please fill all the required fields in layers <span style="color: red">' + layerWithInvalidData + "</span>",
        okType: 'default-button'
      });
    }
  }

  function customValidate(fieldId) {
    value = vm.site.properties[fieldId]
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
    if(!window.cordova){
      var imageURI = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC+qhQAAABwAO1NkJC4HU8CpcVTv7pbS2luGGdgwo9TSA5bXbhrm/aKMgpENvOOves5ZLpYiiSSiPuoY4/KrMlxbSys8ttgscko5HP41H/oZU7ZZ429wGz/ACpgV2nfaFdIyB28sAn8QM1dsroTMLI28aRXDqGKZ3deOSTUDWsT7fLvIjn++GU/yNXNHsHGqxFjGyJlvllU5I6dD60AVr6Cyt7ySFZJiE4ztB5/MVXWKEjP2lR7FWz/ACqS+gnS6mlkgkRTITllOOvrVZ2LtuOMn0oA9Nc7VyOvaud8TtKFggWNjH94kDOT/n+ddBI6qGdzhIxk1yEupXbXEkqTOpY9Ae1IDMfyyWAVs9hnpVYg1snUJWTZIkUgPUtGMn8attDpr6Sl5PabCzlFWJiAx5/wNMDmqStUw6bJuO64iP8ACuAwpo0uKRlW3vYpJHOArKV/WgBuhSSDVIEEjBGb5lB4PFS6lqlyt/OitGFRyqjy1PA+oq/o+i3FpqKy3ATaoJBVs81i3NheC4fdbTFs8kIT+tAHY69P5NisAPzzHn6d65t48dwfpXWX1iL0L9oh3FfulGwRWbJoMO47JZ4hjoRuH50AYDDCk1o6unkW9lZr/wAsot7Y6En2/A/nVq30RvPjZ7yNkVgSFXBOKTVLa8OoTTx2/nI2CCpHAA9PwoEc+Qc1LaRCW8gjbOHkVTj61O7eWoE1u8YHRpIyB9Kn0RUl1aAqNwXLHHbAPP54oAq6/K7atMGPCYUflVGO7uYl2x3EqL6K5Aq1dp5+oXJkkC/O3J74NVJYdjABlYEA5BoGemjJp/1pop46UgGNEj8Min6iomtYuSAVJ9Cas+tNPSmBUNof4ZT/AMCANQrbPEzyJHFubqVGC31q+aaaQHP3eiWs8hdoJYnY5Zo26/zFZ7+HoS52Xbqvo0eSPxyK6w0z8aALAp4IqEGn5oGSZoPNN3UmaBASKa3pSk0wmgBrVGevApzGo80ASg0oaos0oagZNuoz+lQ7uaUtxQIkJ/GmFuaaWphagBzGmE800tTM0ASA0veiigYZoyaKKYhpJ5FNJNFFIY1jTMmiigD/2Q==";
      var timeStampMoment = new moment().valueOf();
      fileName = timeStampMoment + "_" + currentPhotoFieldId +  ".jpg";
      vm.site.properties[currentPhotoFieldId]  = fileName;
      vm.site.files[fileName] = imageURI;
      vm.imagesMimeData[currentPhotoFieldId] = "data:image/jpeg;base64," + imageURI;
      CameraOptionsPopup.close();
    }else{
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
