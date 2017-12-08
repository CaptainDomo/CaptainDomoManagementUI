(function () {
    'use strict';

    angular
        .module('cdmf.navigation.ui', [])
        .controller('NavigationController', NavigationController)
        .component('cmdfNavigation', {
            templateUrl: 'app/navigation/navigation.html',
            controller: 'NavigationController',
            controllerAs: 'vm'
        });

    function NavigationController(
    ) {

    }
})();