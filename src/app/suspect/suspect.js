(function () {
    'use strict';

    angular
        .module('cdmf.suspect', [
            'cdmf.hal'
        ])
        .constant('MEMBERS_FOR_SUSPECT_URL', '/management/suspect/${suspectId}/potentialmembers')
        .constant('RESOLVE_SUSPECT_WITH_EXISTING_MEMBER_URL', '/management/suspect/${suspectId}/resolveWithMember')
        .constant('RESOLVE_SUSPECT_WITH_ADDITIONALSUBSCRIPTION_URL', '/management/suspect/${suspectId}/resolveWithAdditionalSubscription')
        .constant('RESOLVE_SUSPECT_VIA_CREATION_OF_NEW_MEMBER_URL', '/management/suspect/${suspectId}/resolveViaCreationOfNewMember')
        .constant('RESOLVE_SUSPECT_VIA_REJECTION_URL', '/management/suspect/${suspectId}/resolveViaRejection')
        .constant('SUSPECT_URL', '/management/suspect')
        .service('Suspect', Suspect);

    function Suspect(
        $q,
        hal,
        MEMBERS_FOR_SUSPECT_URL,
        RESOLVE_SUSPECT_VIA_REJECTION_URL,
        RESOLVE_SUSPECT_VIA_CREATION_OF_NEW_MEMBER_URL,
        RESOLVE_SUSPECT_WITH_ADDITIONALSUBSCRIPTION_URL,
        RESOLVE_SUSPECT_WITH_EXISTING_MEMBER_URL,
        SUSPECT_URL
    ) {
        function Suspect(resource) {
            return _.extend({}, resource);
        }

        function MemberSearchResult(resource) {
            return _.extend({}, resource);
        }

        function ResolveResult(resource) {
            return _.extend({}, resource);
        }

        _.extend(Suspect, {
            addAdditionalEmail: function (editSuspectId, member, email) {
                var subscription = {};
                subscription['memberNumber'] = member.number;
                subscription['email'] = email;

                var url = _.template(RESOLVE_SUSPECT_WITH_ADDITIONALSUBSCRIPTION_URL);

                return hal
                    .put(url({'suspectId': editSuspectId}), subscription)
                    .then(function (response) {
                        return $q.resolve(response).then(function (response) {
                            return new ResolveResult(response.data);
                        })
                    });
            },
            getAll: function () {
                return hal
                    .get(SUSPECT_URL)
                    .then(function (response) {
                        return $q.resolve(response).then(fromSuspectlist);
                    });
            },
            getMembersForSuspect: function (editSuspectId) {
                var url = _.template(MEMBERS_FOR_SUSPECT_URL);

                return hal
                    .get(url({'suspectId': editSuspectId}))
                    .then(function (response) {
                        return $q.resolve(response).then(function (response) {
                            return fromMemberSearchResultList(response.data.memberSearchResultList);
                        });
                    });
            },
            resolveSuspectWithExistingMember: function (suspectId, member) {
                var resolvedSuspect = _.extend({}, {
                    memberNumber: member.number
                });

                var url = _.template(RESOLVE_SUSPECT_WITH_EXISTING_MEMBER_URL);

                return hal
                    .put(url({'suspectId': suspectId}), resolvedSuspect)
                    .then(function (response) {
                        return $q.resolve(response).then(function (response) {
                            return new ResolveResult(response.data);
                        });
                    });
            },
            resolveSuspectViaCreationOfNewMember: function(suspectId) {
                var url = _.template(RESOLVE_SUSPECT_VIA_CREATION_OF_NEW_MEMBER_URL);

                return hal
                    .put(url({'suspectId': suspectId}))
                    .then(function (response){
                        return $q.resolve(response).then(function (response){
                            return new ResolveResult(response.data)
                        })
                    });

            },
            resolveSuspectViaRejection: function (suspectId) {
                var url = _.template(RESOLVE_SUSPECT_VIA_REJECTION_URL);

                return hal
                    .put(url({'suspectId': suspectId}))
                    .then(function (response) {
                        return $q.resolve(response).then(function (response) {
                            return new ResolveResult(response.data)
                        });
                    });
            }
        });

        function fromMemberSearchResultList(memberSearchResultList) {
            return _.map(memberSearchResultList, function (memberSearchResult) {
                return new MemberSearchResult(memberSearchResult);
            });
        }


        function fromSuspectlist(response) {
            return _.map(response.data.suspectList, function (suspect) {
                return new Suspect(suspect);
            });
        }

        return Suspect;
    }
})();