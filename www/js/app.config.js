angular
.module('app')
.config(configuration);

configuration.$inject = ['$compileProvider'];

function configuration($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
}
