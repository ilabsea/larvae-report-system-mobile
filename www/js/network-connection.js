function isOnline() {
  var online = false;
  if (navigator.connection) {
    online = (navigator.connection.type !== 'none' || navigator.connection.type !== 'unknown');
    return online;
  }
  online = navigator.onLine;
  return online;
}
