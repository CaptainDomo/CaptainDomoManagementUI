(function () {
    'use strict';

    angular
        .module('cdmf', [
            'cdmf.authentication',
            'cdmf.login.ui',
            'cdmf.member.ui',
            'cdmf.navigation.ui',
            'cdmf.subscription.ui',
            'cdmf.suspect.ui',
            'ui.router'
        ])
        .config(state)
        .controller('AppController', AppController);

    function state(
        $stateProvider,
        $urlRouterProvider
    ) {
        $stateProvider
            .state('cdmf', {
                url: '',
                templateUrl: 'app/app.html',
                controller: 'AppController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/suspect');
    }

    function AppController(
        $http,
        $rootScope,
        $state
    ) {
        // keep user logged in after page refresh
        var authentication = JSON.parse(sessionStorage.getItem('authentication')) || {};

        //if on page load / reload user is not logged in -> go to login page
        if (authentication.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authentication.currentUser.authdata;
        }else{
            $state.go('cdmf.login');
        }

        $rootScope.$on('$stateChangeStart', function (event, next) {
            var authentication = JSON.parse(sessionStorage.getItem('authentication')) || {};

            // redirect to login page if not logged in
            if (next.name !== 'cdmf.login' && next.name !== 'cdmf.logout') {
                if (_.isUndefined(authentication.currentUser)) {
                    event.preventDefault();
                    $state.go('cdmf.login');
                }
            }
        });
    }
})();