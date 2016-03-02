angular
.module('app')
.config(translation);

translation.$inject = ['$translateProvider'];

function translation($translateProvider){
  $translateProvider.translations('en', {
    email: "Email",
    password: "Password"
  });
  $translateProvider.translations('lao', {
    email: "ອີເມວ",
    password: "ລະຫັດຜ່ານ"
  });
  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("lao");
}
