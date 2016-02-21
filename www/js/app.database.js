function createTables($cordovaSQLite) {
  if (window.cordova) {
    console.log('database  device');
    db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" }); //device
  }else{
    console.log('web');
    db = window.openDatabase("larvae_report_system.db", '1.0', 'my', 1024 * 1024 * 100); // browser
  }

  // db = window.openDatabase("larvae_report_system.db", "1.0", "Cordova Demo", 200000);
  // db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" });

  var queryCreateSiteTable = "CREATE TABLE IF NOT EXISTS sites" +
                      "(id integer primary key, collection_id integer, " +
                      "user_id integer, village_id integer, device_id text, " +
                      "week_number integer, year integer, properties text, files text)";

  $cordovaSQLite.execute(db, queryCreateSiteTable);

}
