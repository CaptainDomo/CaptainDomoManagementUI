(function () {
    'use strict';

    angular
        .module('cdmf.login.ui', [
            'cdmf.authentication',
            'ui.router'
        ])
        .config(state)
        .controller('LoginController', LoginController);

    function state($stateProvider) {
        $stateProvider
            .state('cdmf.login', {
                controller: 'LoginController',
                controllerAs: 'vm',
                url: '/login',
                templateUrl: 'app/login/login.html'
            });

        $stateProvider
            .state('cdmf.logout', {
                controller: 'LoginController',
                controllerAs: 'vm',
                url: '/logout',
                templateUrl: 'app/login/login.html'
            });
    }

    function LoginController(
        $state,
        AuthenticationService
    ) {
        var vm = this;

        AuthenticationService.ClearCredentials();

        _.extend(vm, {
            login: login
        });

        function login() {
            vm.dataLoading = true;

            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.data && response.data.success === true) {
                    $state.go('cdmf.suspect');
                    vm.dataLoading = false;
                } else {
                    vm.error = 'Anmeldung fehlgeschlagen';
                    vm.dataLoading = false;
                }
            });
        }
    }
})();
