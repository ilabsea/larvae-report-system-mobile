function isOnline() {
  var online = false;
  if (navigator.connection) {
    online = (navigator.connection.type !== Connection.NONE);
    // online = (navigator.connection.type !== 'none' || navigator.connection.type !== 'unknown');
    console.log('online : ', online);
    return online;
  }
  online = navigator.onLine;
  return online;
}
