var db = null;
function createTables($cordovaSQLite) {
  if (window.cordova) {
    db = $cordovaSQLite.openDB({ name: "larvae_report_system.db" }); //device
  }else{
    db = window.openDatabase("larvae_report_system.db", '1.0', 'larvae report system database', 1024 * 1024 * 100); // browser
  }

  var user = "CREATE TABLE IF NOT EXISTS users (id integer primary key, user_id integer, " +
        "email text, password text)";
  var collection = "CREATE TABLE IF NOT EXISTS collections (id integer primary key, " +
        "collection_id integer, user_id integer, name text)";
  var place = "CREATE TABLE IF NOT EXISTS places (id integer primary key, name text, place_id integer, "  +
        "parent_place_id integer, parent_place_name text)";
  var site = "CREATE TABLE IF NOT EXISTS sites (id integer primary key, collection_id integer, " +
        "user_id integer, place_id integer, device_id text, name text, week_number integer, " +
        "year integer, properties text, files text)";

  $cordovaSQLite.execute(db, user);
  $cordovaSQLite.execute(db, collection);
  $cordovaSQLite.execute(db, place);
  $cordovaSQLite.execute(db, site);
}
