angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/'
  // api: 'http://192.168.56.102:3000/api/',
  // photo_path: "http://192.168.56.102:3000/photo_field/"
  api: 'http://192.168.1.127:3000/api/',
  photo_path: "http://192.168.1.127:3000/photo_field/"
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  collections: "collections?auth_token=",
  layers: 'v1/collections/7/fields?auth_token=',
  sites: 'v1/collections/7/sites?auth_token=',
  get_site_by_week_year_placeId: 'v1/collections/7/sites/get_site_by_week_year_place.json?auth_token=',
  villages: 'v1/collections/7/places/my_supervision_place.json?auth_token='
})
