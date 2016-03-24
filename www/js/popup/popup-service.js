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

  function confirmPopup(title, template, callback) {
    $ionicPopup.confirm({
     title: $translate.instant(title),
     template: $translate.instant(template),
     buttons: [{
        text: $translate.instant("global.no"),
      }, {
        text: $translate.instant("global.yes"),
        type: 'default-button',
        onTap: callback
      }]
    });
  }

  return {
    alertPopup : alertPopup,
    confirmPopup: confirmPopup
  }
}
