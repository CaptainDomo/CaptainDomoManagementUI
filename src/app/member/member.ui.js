(function () {
    'use strict';

    angular
        .module('cdmf.member.ui', [
            'cdmf.member.csvlistimporter.ui',
            'cdmf.member.memberlist.ui',
            'ui.router'
        ])
        .controller('MemberController', MemberController)
        .config(state);

    function state(
        $stateProvider
    ) {
        $stateProvider
            .state('cdmf.member', {
                url: '/member',
                templateUrl: 'app/member/member.html',
                controller: 'MemberController',
                controllerAs: 'vm'
            });
    }

    function MemberController() {

    }
})();