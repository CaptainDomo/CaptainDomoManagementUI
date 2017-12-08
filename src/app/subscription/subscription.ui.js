/*
 * Created by melancheir on 13.08.16.
 */

(function () {
    'use strict';

    angular
        .module('cdmf.subscription.ui', [
            'cdmf.subscriptionlist.ui',
            'ui.router'
        ])
        .config(state);

    function state($stateProvider) {
        $stateProvider
            .state('cdmf.subscription', {
                url: '/subscription',
                templateUrl: 'app/subscription/subscription.html'
            });
    }
})();