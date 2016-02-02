angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/'
  api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  collections: "collections?auth_token=",
  layers: 'v1/collections/39/fields?auth_token=',

})
