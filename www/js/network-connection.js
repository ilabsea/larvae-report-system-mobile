function isOnline() {
  var online = false;
  if (navigator.connection) {
    online = (navigator.connection.type !== Connection.NONE);
    return online;
  }
  online = navigator.onLine;
  return online;
}
