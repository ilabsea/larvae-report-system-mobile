angular.module('app')

.controller('SiteCtrl', function () {
  var db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" });
  var queryCreateSiteTable = "CREATE TABLE IF NOT EXISTS sites (id integer primary key, " +
    "collection_id integer, user_id integer, village_id integer, device_id text," +
    "properties json, files json)");
  $cordovaSQLite.execute(db, queryCreateSiteTable);

  $scope.saveSite = function(site) {
    var query = "INSERT INTO
            sites (collection_id, user_id, village_id, device_id, properties, files)
            VALUES (?, ?, ?, ?, ?, ?)";
    var siteData = [site.collection_id, site.user_id, site.village_id, site.device_id,
                site.properties, site.files]
    $cordovaSQLite.execute(db, query, siteData).then(function(res) {
      console.log("insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
  };
})
