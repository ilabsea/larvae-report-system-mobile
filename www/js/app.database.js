function createTables($cordovaSQLite) {
  db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" });
  var queryCreateSiteTable = "CREATE TABLE IF NOT EXISTS sites (id integer primary key, collection_id integer, user_id integer, village_id integer, device_id text,properties json, files json)";
  $cordovaSQLite.execute(db, queryCreateSiteTable);
}
