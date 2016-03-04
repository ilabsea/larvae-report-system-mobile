angular.module('app')
.factory('CalculationService', CalculationService)
CalculationService.$inject = []

function CalculationService() {

  // take the longer field code to be the front in config
  function restructureDependentFields(calculationField) {
    var dependentFieldsCodelength = 0;
    var dependentFields = calculationField.config.dependent_fields;

    angular.forEach(dependentFields, function () {
      dependentFieldsCodelength++;
    });
    var tmp = "";
    for (var i = 0; i < dependentFieldsCodelength - 1; i++) {
      for (var j = i + 1; j < dependentFieldsCodelength; j++) {
        if (dependentFields[i]["code"].length < dependentFields[j]["code"].length) {
          tmp = dependentFields[i];
          dependentFields[i] = dependentFields[j];
          dependentFields[j] = tmp;
        }
      }
    }
    return dependentFields;
  }

  function generateSyntax(calculationField) {
    var codeCalculation = calculationField.config.code_calculation;
    if (codeCalculation) {
      dependentFields = restructureDependentFields(calculationField);

      angular.forEach(dependentFields, function(dependField) {
        var fieldName = "${" + dependField.code + "}";
        var fieldValue = "site.properties[" + dependField.id + "]";
        codeCalculation = codeCalculation.replace(new RegExp(fieldName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), fieldValue);
      });
    }
    return codeCalculation;
  }

  return{
    getDependentFields: restructureDependentFields,
    generateSyntax: generateSyntax
  }
}
