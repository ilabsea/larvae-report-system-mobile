angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/',
  api: 'http://192.168.1.108:3000/api/',
  photo_path: "http://192.168.1.108:3000/photo_field/"
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  sign_out: 'users/sign_out?auth_token=',
  collections: "collections?auth_token=",
  layers: 'v1/collections/9/fields?auth_token=',
  sites: 'v1/collections/9/sites?auth_token=',
  update_site: 'v1/collections/9/sites/',
  get_site_by_week_year_placeId: 'v1/collections/9/sites/get_site_by_week_year_place.json?auth_token=',
  get_parent_place_by_ancestry: 'v1/collections/9/places/get_parent_place_by_ancestry_id.json?auth_token=',
  places: 'v1/collections/9/places/my_supervision_place.json?auth_token=',
  place_memberships: 'v1/collections/9/places/memberships.json?auth_token='
})
