(function () {
    'use strict';

    angular
        .module('cdmf.suspectlist.ui', [
            'cdmf.suspect'
        ])
        .controller('SuspectlistController', SuspectlistController)
        .component('cdmfSuspectlist', {
            controller: 'SuspectlistController',
            controllerAs: 'vm',
            templateUrl: 'app/suspect/suspectlist/suspectlist.html'
        });

    function SuspectlistController(
        Suspect
    ) {
        var vm = this;

        var memberSearchResultSelectedForResolving = undefined;
        var idOfSuspectInEditMode = undefined;

        _.extend(vm, {
            memberSearchResultList: [],
            resolveResult: undefined,
            suspects: []
        });

        _.extend(vm, {
            addAdditionalEmail: addAdditionalEmail,
            loadEditSuspect: loadEditSuspect,
            resolveSuspectWithExistingMember: resolveSuspectWithExistingMember,
            resolveSuspectViaCreationOfNewMember: resolveSuspectViaCreationOfNewMember,
            resolveSuspectViaRejection: resolveSuspectViaRejection,
            isSuspectInEditMode: isSuspectInEditMode,
            isMemberSearchResultSelectedForResolving: isMemberSearchResultSelectedForResolving
        });

        // Initial loading
        Suspect
            .getAll()
            .then(function (suspects) {
                vm.suspects = suspects;
            });

        function addAdditionalEmail(member, email) {
            Suspect
                .addAdditionalEmail(idOfSuspectInEditMode, member, email)
                .then(function (resolveResult) {
                    vm.resolveResult = resolveResult;

                    if (resolveResult.resolveWithAdditionalSubscriptionResultCode === 'SUBSCRIPTION_ADDED')
                        vm.suspects = _.reject(vm.suspects, {'id': idOfSuspectInEditMode});
                });
        }

        function loadEditSuspect(suspectId) {
            memberSearchResultSelectedForResolving = undefined;
            vm.resolveResult = undefined;

            if (suspectId === idOfSuspectInEditMode) {
                idOfSuspectInEditMode = undefined;
                return;
            }

            Suspect
                .getMembersForSuspect(suspectId)
                .then(function (membersForSuspect) {
                    vm.memberSearchResultList = membersForSuspect;
                    idOfSuspectInEditMode = suspectId;
                });
        }

        function resolveSuspectWithExistingMember(memberSearchResult) {
            if (memberSearchResultSelectedForResolving === memberSearchResult) {
                return;
            }

            memberSearchResultSelectedForResolving = memberSearchResult;

            Suspect
                .resolveSuspectWithExistingMember(idOfSuspectInEditMode, memberSearchResult.member)
                .then(function (resolveResult) {
                    vm.resolveResult = resolveResult;

                    if (resolveResult.suspectResolvingResultCode === 'SUBSCRIPTION_ADDED')
                        vm.suspects = _.reject(vm.suspects, {'id': idOfSuspectInEditMode});
                });
        }

        function resolveSuspectViaCreationOfNewMember(memberSearchResult){
            if (memberSearchResultSelectedForResolving === memberSearchResult) {
                return;
            }

            memberSearchResultSelectedForResolving = memberSearchResult;

            Suspect
                .resolveSuspectViaCreationOfNewMember(idOfSuspectInEditMode)
                .then(function (resolveResult) {
                    vm.resolveResult = resolveResult;

                    if (resolveResult.suspectResolvingResultCode === 'SUBSCRIPTION_ADDED')
                        vm.suspects = _.reject(vm.suspects, {'id': idOfSuspectInEditMode});
                });
        }

        function resolveSuspectViaRejection(suspectId) {
            Suspect
                .resolveSuspectViaRejection(suspectId)
                .then(function (resolveResult) {
                    vm.resolveResult = resolveResult;

                    if (resolveResult.suspectResolvingResultCode === 'SUSPECT_REJECTED_SUCCESSFULLY')
                        vm.suspects = _.reject(vm.suspects, {'id': suspectId});
                });
        }

        function isSuspectInEditMode(suspect) {
            return suspect.id === idOfSuspectInEditMode;
        }

        function isMemberSearchResultSelectedForResolving(memberSearchResult) {
            return memberSearchResultSelectedForResolving === memberSearchResult;
        }
    }
})();