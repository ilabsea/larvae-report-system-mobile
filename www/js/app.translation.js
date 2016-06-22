angular
.module('app')
.config(translation);

translation.$inject = ['$translateProvider'];

function translation($translateProvider){
  $translateProvider.useStaticFilesLoader({
    prefix: 'locales/',
    suffix: '.json'
  })
  var language = localStorage.getItem("language");
  language ? $translateProvider.preferredLanguage(language) : $translateProvider.preferredLanguage("lao");
}
