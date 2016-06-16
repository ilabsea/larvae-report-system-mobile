angular.module('app')
.factory('PopupService', PopupService)

PopupService.$inject = ["$translate", "$ionicPopup"]

function PopupService($translate, $ionicPopup){

  function alertPopup(title, template, templateUrl, scope) {
    return $ionicPopup.alert({
      title: $translate.instant(title),
      template: $translate.instant(template),
      templateUrl: templateUrl,
      scope: scope,
      okText: $translate.instant("global.ok"),
      okType: 'default-button'
    });
  }

  function confirmPopup(title, template, callback, dynamicString, noCallback) {
    $ionicPopup.confirm({
     title: $translate.instant(title),
     template: $translate.instant(template) + dynamicString,
     buttons: [{
        text: $translate.instant("global.no"),
        onTap: noCallback
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
