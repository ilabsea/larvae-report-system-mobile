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
  var place = "CREATE TABLE IF NOT EXISTS places (id integer primary key, place_id integer, " +
        "name text, user_id integer, parent_place_id integer, parent_place_name text)";
  var site = "CREATE TABLE IF NOT EXISTS sites (id integer primary key, collection_id integer, " +
        "user_id integer, place_id integer, device_id text, name text, week_number integer, " +
        "year integer, properties text, files text)";
  var layer = "CREATE TABLE IF NOT EXISTS layers (id integer primary key, layer_id integer, " +
        "collection_id integer, user_id integer, name text, field_offline_id integer,"+
        "FOREIGN KEY(field_offline_id) REFERENCES fields (id))";
  var field = "CREATE TABLE IF NOT EXISTS fields (id integer primary key, field_id integer, " +
        "name text, kind text, code text, config text, is_mandatory integer, is_enable_field_logic integer, " +
        "remember_last_input integer, default_value text, layer_id integer, " +
        "FOREIGN KEY(layer_id) REFERENCES layers (layer_id))";
  var placeMembership  = "CREATE TABLE IF NOT EXISTS place_memberships (id integer primary key, user_id integer, " +
        "admin integer, layers text, sites text)";

  $cordovaSQLite.execute(db, user);
  $cordovaSQLite.execute(db, collection);
  $cordovaSQLite.execute(db, place);
  $cordovaSQLite.execute(db, site);
  $cordovaSQLite.execute(db, layer);
  $cordovaSQLite.execute(db, field);
  $cordovaSQLite.execute(db, placeMembership);
}
