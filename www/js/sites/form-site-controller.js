angular.module('app')
.controller("FormSiteCtrl", FormSiteCtrl)
FormSiteCtrl.$inject = ["$scope", "$state", "$ionicPopup", "$filter", "$timeout",
            "$ionicHistory", "VillagesService","FormSiteService", "SiteService",
            "CameraService", "moment"]

function FormSiteCtrl($scope, $state, $ionicPopup, $filter, $timeout,
            $ionicHistory, VillagesService, FormSiteService, SiteService, CameraService, moment) {
  var vm = $scope, currentPhotoFieldId;
  vm.site = {properties : {}, id:'', files: {}};
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
  vm.imagesMimeData = {};

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
          var photoFieldsId = FormSiteService.getPhotoFieldsid()
          angular.forEach(dateFieldsId, function(id) {
            vm.propertiesDate[id] = new Date(vm.site.properties[id]);
          });
          angular.forEach(photoFieldsId, function(id) {
            var propertiesPhoto = vm.site.properties[id];
            var files = angular.fromJson(site[0]).files;
            var imageURI = angular.fromJson(site[0]).files[propertiesPhoto];
            if(imageURI)
              vm.imagesMimeData[id] = "data:image/jpeg;base64," + imageURI;
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
      SiteService.insertSite(site);
    $state.go('villages');
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
      console.log('vallue : ', type);

      FormSiteService.getPicture(cameraOptions).then(function(imageURI) {
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

  function backToVillage(){
    $ionicHistory.goBack();
  }
}
