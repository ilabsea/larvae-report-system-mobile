angular.module('app')

.controller('FormSiteCtrl', function($scope, $state, $ionicPopup,  $ionicHistory, FormSiteService, CameraService) {
  $scope.items = [{name: 'first task 1', tree: [{name: 'first task 1.1'}]},
     {name: 'first task 2'}];

  $scope.getLayers = function() {
    FormSiteService.fetch().then(function(layers){
      $scope.layers = layers;
      $scope.fields = FormSiteService.getFields(layers[0].id);
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

  $scope.backToVillage = function(){
    $ionicHistory.goBack();
  }

  $scope.takePicture = function(){
    cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    }

    CameraService.getPicture(cameraOptions).then(function(imageURI) {
      $scope.lastPhoto = imageURI;
      console.log("imageURI : ", imageURI);
    }, function(err) {
      console.err(err);
    });
  }
})
