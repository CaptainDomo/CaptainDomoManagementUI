(function () {
    'use strict';

    angular
        .module('cdmf.suspect.ui', [
            'cdmf.suspectlist.ui',
            'ui.router'
        ])
        .config(state);

    function state(
        $stateProvider
    ) {
        $stateProvider
            .state('cdmf.suspect', {
                url: '/suspect',
                templateUrl: 'app/suspect/suspect.html'
            })
    }
})();