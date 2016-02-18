angular.module('app')
.factory("VillagesService", VillagesService)

VillagesService.$inject = [];

var villages = [
{
  id: 1,
  name: 'Phouvong'
}, {
  id: 2,
  name: 'Samakkhixay'
}, {
  id: 3,
  name: 'Sanamxay'
}, {
  id: 4,
  name: 'Sanxay'
},
{
  id: 5,
  name: 'Saysetha'
}];

function VillagesService() {
  var village_id;

  function all(){
    return villages;
  }

  function setSelectedVillageId(id){
    village_id = id;
  }

  function getSelectedVillageId() {
    return village_id;
  }

  return {
    all: all,
    setSelectedVillageId: setSelectedVillageId,
    getSelectedVillageId: getSelectedVillageId
  };
}
