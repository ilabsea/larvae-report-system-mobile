angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/'
  api: 'http://192.168.1.113:3000/api/'
  // api: 'http://192.168.1.101:3000/api/'
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  collections: "collections?auth_token=",
  layers: 'v1/collections/7/fields?auth_token=',
  sites: 'v1/collections/7/sites?auth_token='
})
