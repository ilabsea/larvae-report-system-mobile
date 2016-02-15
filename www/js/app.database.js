function createTables($cordovaSQLite) {
  db = window.openDatabase("larvae_report_system.db", "1.0", "Cordova Demo", 200000);
  // db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" });

  var queryCreateSiteTable = "CREATE TABLE IF NOT EXISTS sites" +
                      "(id integer primary key, collection_id integer, " +
                      "user_id integer, village_id integer, device_id text, " +
                      "properties text, files text)";

  $cordovaSQLite.execute(db,
      "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
  $cordovaSQLite.execute(db, queryCreateSiteTable);

}
