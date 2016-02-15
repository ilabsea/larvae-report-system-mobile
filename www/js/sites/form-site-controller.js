angular.module('app')

.controller('FormSiteCtrl', function($scope, $state, $ionicPopup, $filter,
            $ionicHistory, FormSiteService, CameraService) {
  $scope.site = {properties : {}};
  $scope.propertiesDate = {};
  $scope.fields = [];
  $scope.photo = 'img/camera.png';

  $scope.getLayers = function() {
    FormSiteService.fetch().then(function(layers){
      $scope.layers = layers;
      $scope.fields = layers.length > 0 ? FormSiteService.getFields(layers[0].id) : [];
    }, function(error){
      var alertPopup = $ionicPopup.alert({
        title: 'Fetch data failed',
        template: 'Please try aggain!'
      });
    })
  }

  $scope.renderFieldsForm = function(layerId){
    $scope.fields = FormSiteService.getFields(layerId);
  }

  $scope.saveSite = function (site, propertiesDate) {
    angular.forEach(propertiesDate, function (date, key) {
      site.properties[key] =  $filter('date')(date, 'MM/dd/yyyy');
    });
    FormSiteService.saveSite(site);
    $state.go('villages');
    $scope.fields = [];
  }

  $scope.showChoiceCameraPopup = function(){
    var popup = $ionicPopup.show({
      templateUrl: "templates/camera-options.html",
      title: 'Photo options',
      scope: $scope,
      buttons: [{ text: 'Cancel' }]
    });
  }

  $scope.getPhoto = function (value) {
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
      $scope.photo = "data:image/jpeg;base64," + imageURI;
      console.log("imageURI : ", imageURI);
    }, function(err) {
      console.err(err);
    });
  }

  $scope.backToVillage = function(){
    $ionicHistory.goBack();
  }
})
