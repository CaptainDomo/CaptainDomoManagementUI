(function () {
    'use strict';

    angular
        .module('cdmf.precheckmember', [
            'cdmf.hal'
        ])
        .constant('PRECHECK_MEMBERS_URL', '/management/member/preCheckMember/${preCheckMemberId}')
        .service('PreCheckMember', PreCheckMember);

    function PreCheckMember(
        $q,
        hal,
        PRECHECK_MEMBERS_URL
    ) {
        function PreCheckMember(resource) {
            return _.extend({}, resource);
        }

        function PublishPreCheckedMembersResult(resource) {
            return resource.data.publishPreCheckedMembersResult;
        }

        function fromPreCheckMemberList(resource) {
            return _.map(resource.data.memberList, function (preCheckMember) {
                return new PreCheckMember(preCheckMember);
            })
        }


        _.extend(PreCheckMember, {
            getById: function (preCheckMemberId) {
                var url = _.template(PRECHECK_MEMBERS_URL);

                return hal
                    .get(url({'preCheckMemberId': preCheckMemberId}))
                    .then(function (response) {
                        return $q.resolve(fromPreCheckMemberList(response))
                    });
            },
            publish: function (preCheckMemberId) {
                var url = _.template(PRECHECK_MEMBERS_URL);

                return hal
                    .put(url({'preCheckMemberId': preCheckMemberId}))
                    .then(function (response) {
                        return $q.resolve(new PublishPreCheckedMembersResult(response));
                    });
            }
        });

        return PreCheckMember;
    }
})();