module Strix.Interfaces {
    export interface IDropDownDirectiveScope extends ng.IScope {
        data: any[];
        oldModelValue: any
    }
}

module Strix {
    var directivesModule = angular.module('strixIT', []);
    directivesModule.directive('strixDropDown', DropDownDirective);

    export function DropDownDirective(): ng.IDirective {
        return {
            require: 'ngModel',
            priority: 100,
            scope: { model: '=ngModel', data: '=source', changeCallback: '=' },
            link: function (scope: Strix.Interfaces.IDropDownDirectiveScope, elem, attr, ngModel) {
                var optionLabel = attr['optionLabel'] || 'Name';
                var optionValue = attr['optionValue'] || undefined;
                var defaultFlag = attr['defaultFlag'];
                var tabIndex = attr['tabindex'];
                var select = null;

                // Save the model value on linking of the directive. This value needs to be stored to be able to set a
                // dropdown correctly when multiple changes of the datasource are triggered before its value is set.
                scope.oldModelValue = null;

                // Create the select element, if it is not present already.
                select = findOrCreateSelectElement(elem, tabIndex);

                // Watch the data source for changes and recreate the dropdown when changes occur.
                scope.$watchCollection('data', function (newValue, oldValue) {
                    dataChanged(select, scope, ngModel, optionLabel, optionValue, defaultFlag);
                });

                // Handle the selection of a dropdown option.
                select.change(function (e) {
                    onChange(e.currentTarget.value, scope, optionLabel, optionValue, ngModel);
                });
            }
        }

        function findOrCreateSelectElement(elem, tabIndex) {
            var select;

            if (elem.is('select')) {
                select = elem;
            }
            else {
                select = elem.find('select');
            }

            if (!select.length) {
                select = $('<select class="pre-select"></select>');
                elem.append(select);
            }

            // If a tabindex was specified, set this index on the select and remove it from the parent element.
            if (tabIndex && !select.attr('tabIndex')) {
                select.attr('tabindex', tabIndex);
                elem.removeAttr('tabindex');
            }

            return select;
        }

        function dataChanged(select, scope, ngModel, optionLabel, optionValue, defaultFlag) {
            if (scope.data) {
                var selectedValue;

                // Store the old model value on the first data change.
                if (!scope.oldModelValue) {
                    scope.oldModelValue = scope.model;
                }

                selectedValue = buildSelect(select, scope, optionLabel, optionValue, defaultFlag);

                // Call onchange to actually set the view value.
                onChange(selectedValue, scope, optionLabel, optionValue, ngModel);
            }
        }

        function buildSelect(select, scope, optionLabel, optionValue, defaultFlag) {
            var selectedValue, options = [];
            var label = getOptionLabel(scope, optionLabel);

            select.empty();

            for (var n in scope.data) {
                var entry = scope.data[n];
                var entryValue = optionValue && entry[optionValue] || entry[optionLabel] || entry;

                if (scope.model == entryValue || scope.oldModelValue == entryValue || (entry[defaultFlag] && !selectedValue)) {
                    selectedValue = entryValue;
                }

                options.push($('<option value="' + entryValue + '">' + (entry[optionLabel] || entry) + '</option>'));
            }

            if (!selectedValue) {
                selectedValue = scope.data[0] ? optionValue && scope.data[0][optionValue] || scope.data[0] : null;
            }

            for (var n in options) {
                var option = options[n];

                if (option.attr('value') == selectedValue) {
                    option.attr('selected', 'selected');
                }

                select.append(option);
            }

            return selectedValue;
        }

        function onChange(value, scope, optionLabel, optionValue, ngModel) {
            if (!optionValue) {
                if (typeof value === 'object') {
                    value = value
                } else {
                    var label = getOptionLabel(scope, optionLabel);
                    value = scope.data.filter(x => { return label ? x[label] === value : x === value; })[0];
                }
            }

            // Do the callback before updating the view value. This order is important, which has something
            // to do with the angular digest cycle. I'm not sure what exactly.
            if (scope.changeCallback) {
                scope.changeCallback(value);
            }

            ngModel.$setViewValue(value);
        }

        function getOptionLabel(scope, optionLabel) {
            return scope.data && scope.data.length > 0 && scope.data[0][optionLabel] ? optionLabel : null;
        }
    }
}