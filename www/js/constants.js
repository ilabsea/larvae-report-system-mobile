angular.module('app')

.constant("ENDPOINT", {
  // api: 'http://cam-monitoring.info:8080/api/',
  api: 'http://192.168.1.140:3000/api/',
  photo_path: "http://192.168.1.140:3000/photo_field/"
  // api: 'http://localhost:8100/api/'
})

.constant("API", {
  sign_in: 'users/sign_in.json',
  sign_out: 'users/sign_out?auth_token=',
  collections: "collections?auth_token=",
  collectionsv1: "v1/collections/",
  layers: '/fields?auth_token=',
  sites: '/sites?auth_token=',
  update_site: '/sites/',
  get_site_by_week_year_placeId: '/sites/get_site_by_week_year_place.json?auth_token=',
  get_parent_place_by_ancestry: '/places/get_parent_place_by_ancestry_id.json?auth_token=',
  places: '/places/my_supervision_place.json?auth_token=',
  place_memberships: '/places/memberships.json?auth_token='
})
