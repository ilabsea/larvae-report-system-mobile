angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$filter",
            "$ionicHistory", "VillagesService","FormSiteService", "SiteService", "CameraService"]

function FormSiteCtrl($scope, $state, $ionicPopup, $filter,
            $ionicHistory, VillagesService, FormSiteService, SiteService, CameraService) {
  var vm = $scope;
  vm.site = {properties : {}, id:''};
  vm.propertiesDate = {};
  vm.fields = [];
  vm.photo = 'img/camera.png';
  vm.getLayers = getLayers;
  vm.renderFieldsForm = renderFieldsForm;
  vm.saveSite = saveSite;
  vm.showChoiceCameraPopup = showChoiceCameraPopup;
  vm.getPhoto = getPhoto;
  vm.backToVillage = backToVillage;
  vm.isUpdateSite = false;

  function getLayers() {
    FormSiteService.fetch().then(function(layers){
      vm.layers = layers;
      vm.fields = layers.length > 0 ? FormSiteService.getFields(layers[0].id) : [];
      var villageId = VillagesService.getSelectedVillageId();
      SiteService.getSiteByVillageIdInWeekYear(villageId).then(function(site){
        if(site.length > 0){
          vm.isUpdateSite = true;
          vm.site.properties = angular.fromJson(site[0].properties);
          vm.site.id = site[0].id;
          var dateFieldsId = FormSiteService.getDateFieldsId();
          angular.forEach(dateFieldsId, function(id) {
            vm.propertiesDate[id] = new Date(vm.site.properties[id]);
          });
        }else{
          vm.isUpdateSite = false;
        }
      });
    }, function(error){
      var alertPopup = $ionicPopup.alert({
        title: 'Fetch data failed',
        template: 'Please try aggain!'
      });
    })
  }

  function renderFieldsForm(layerId){
    vm.fields = FormSiteService.getFields(layerId);
    if(layerId == FormSiteService.getLastLayerId())
      vm.isLastTab = true;
    else
      vm.isLastTab = false;
  }

  function saveSite(site, propertiesDate) {
    angular.forEach(propertiesDate, function (date, key) {
      site.properties[key] =  $filter('date')(date, 'MM/dd/yyyy');
    });
    if(vm.isUpdateSite)
      SiteService.updateSite(site, vm.site.id);
    else
      SiteService.saveSite(site);
    $state.go('villages');
    vm.fields = [];
  }

  function showChoiceCameraPopup(){
    var popup = $ionicPopup.show({
      templateUrl: "templates/camera-options.html",
      title: 'Photo options',
      scope: $scope,
      buttons: [{ text: 'Cancel' }]
    });
  }

  function getPhoto(value) {
    var cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.value,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    }

    CameraService.getPicture(cameraOptions).then(function(imageURI) {
      vm.photo = "data:image/jpeg;base64," + imageURI;
      console.log("imageURI : ", imageURI);
    }, function(err) {
      console.err(err);
    });
  }

  function backToVillage(){
    $ionicHistory.goBack();
  }
}
