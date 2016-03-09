angular.module('app')
.factory('PopupService', PopupService)

PopupService.$inject = ["$translate", "$ionicPopup"]

function PopupService($translate, $ionicPopup){

  function alertPopup(title, template) {
    $ionicPopup.alert({
      title: $translate.instant(title),
      template: $translate.instant(template),
      okText: $translate.instant("global.ok"),
      okType: 'default-button'
    });
  }

  return {
    alertPopup : alertPopup
  }
}
