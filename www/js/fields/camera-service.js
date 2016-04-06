angular.module('app')
.factory('CameraService', CameraService)
CameraService.$inject = ["$q"]

function CameraService($q) {

  function getPicture(options) {
    var q = $q.defer();
    var cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    }

    navigator.camera.getPicture(function(result) {
      q.resolve(result);
    }, function(err) {
      q.reject(err);
    }, cameraOptions);

    return q.promise;
  }

  return {
    getPicture: getPicture
  }
}
