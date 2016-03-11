angular
.module('app')
.config(translation);

translation.$inject = ['$translateProvider'];

function translation($translateProvider){
  $translateProvider.useStaticFilesLoader({
    prefix: 'js/locales/',
    suffix: '.json'
  })
  $translateProvider.preferredLanguage("lao");
  $translateProvider.fallbackLanguage("lao");
}
