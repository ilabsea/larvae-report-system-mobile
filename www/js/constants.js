angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/'
  url: 'http://192.168.1.116:3000/',
  api: 'http://192.168.1.116:3000/api/'
  // api: 'http://192.168.1.18:3000/api/'
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  collections: "collections?auth_token=",
  layers: 'v1/collections/7/fields?auth_token=',
  sites: 'v1/collections/7/sites?auth_token=',
  villages: 'v1/collections/7/places/my_supervision_place.json?auth_token='
})
