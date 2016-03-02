// Note:  Customize lib by adding more functionalities as explain in the comment

"use strict";

var CONF = {
    baseUrl: 'lib/ion-tree-list',
    digestTtl: 35
};

function addDepthToTree(obj, depth, collapsed) {
    for (var key in obj) {
        if (typeof(obj[key]) == 'object') {
            obj[key].depth = depth;
            obj[key].collapsed = collapsed;
            // change from tree to sub
            // addDepthToTree(obj[key], key === 'tree' ? ++ depth : depth, collapsed)
            addDepthToTree(obj[key], key === 'sub' ? ++ depth : depth, collapsed)
        }
    }
    return obj
}

function toggleCollapse(obj) {
    for (var key in obj) {
        if (typeof(obj[key]) == 'object') {
            obj[key].collapsed = !obj[key].collapsed;
            toggleCollapse(obj[key])
        }
    }
    return obj
}

angular.module('ion-tree-list', [], function($rootScopeProvider){
    $rootScopeProvider.digestTtl(CONF.digestTtl)
})
.directive('ionTreeList', function () {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            collapsed: '=',
            value: '=', // add custom default value
            templateUrl: '@'
        },
        // templateUrl: CONF.baseUrl + '/ion-tree-list.tmpl.html',
        templateUrl: 'templates/ion-tree-list.html',
        link: function($scope, element, attrs){ // change from comment to link
            $scope.baseUrl = CONF.baseUrl;
            $scope.toggleCollapse = toggleCollapse;
//******* Add custom function for select item and get selected value ********
            $scope.selectedItem = '';
            $scope.valueProperty = attrs.valueProperty || "id";
            $scope.disabledClick = attrs.disabledClick === 'false' ? false : true;

            $scope.setSelected = function (item) {
              $scope.selectedItem = item;
              if(item){
                $scope.valueProperty = item.id;
                $scope.value = item.id;
              } else{
                $scope.valueProperty = attrs.valueProperty || "id";
                $scope.value = "";
              }

            }
/////////////////////////////////////////////////////////////////////////////////
            $scope.$watch('collapsed', function(){
                $scope.toggleCollapse($scope.items);
            });

            $scope.$watch('items', function(){
                $scope.items = addDepthToTree($scope.items, 1, $scope.collapsed);
            });

            $scope.templateUrl = $scope.templateUrl ? $scope.templateUrl : 'item_default_renderer';
        }
    }
});
