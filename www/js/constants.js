angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/',
  api: 'http://110.74.204.121:3003/api/',
  photo_path: "http://110.74.204.121:3003/photo_field/"
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  sign_out: 'users/sign_out?auth_token=',
  collections: "collections?auth_token=",
  layers: 'v1/collections/9/fields?auth_token=',
  sites: 'v1/collections/9/sites?auth_token=',
  get_site_by_week_year_placeId: 'v1/collections/9/sites/get_site_by_week_year_place.json?auth_token=',
  get_parent_place_by_village_ancestry: 'v1/collections/9/places/get_parent_place_by_ancestry_id.json?auth_token=',
  villages: 'v1/collections/9/places/my_supervision_place.json?auth_token='
})
