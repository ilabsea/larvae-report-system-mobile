angular.module('app')
.factory("VillagesService", VillagesService)

VillagesService.$inject = [];

var villages = [{
  id: 0,
  name: 'Saysetha'
}, {
  id: 1,
  name: 'Phouvong',
}, {
  id: 2,
  name: 'Samakkhixay'
}, {
  id: 3,
  name: 'Sanamxay',
}, {
  id: 4,
  name: 'Sanxay',
}];

function VillagesService() {
  return {
    all: function() {
      return villages;
    }
  };
}
