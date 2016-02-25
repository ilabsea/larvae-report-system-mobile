angular
.module('app')
.config(configuration);

configuration.$inject = ['$compileProvider', '$ionicConfigProvider'];

function configuration($compileProvider, $ionicConfigProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.scrolling.jsScrolling(true);
}
