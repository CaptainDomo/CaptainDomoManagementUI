(function () {
    'use strict';

    angular
        .module('cdmf.member', [
            'cdmf.hal'
        ])
        .constant('MEMBER_URL', '/management/member')
        .service('Member', Member);

    function Member(
        $q,
        hal,
        MEMBER_URL
    ) {
        function Member(resource) {
            return _.extend({}, resource);
        }

        function fromMemberList(resource) {
            return _.map(resource.data.memberList, function (member) {
                return new Member(member);
            })
        }

        _.extend(Member, {
            getAll: function () {
                return hal
                    .get(MEMBER_URL)
                    .then(function (response) {
                        return $q.resolve(fromMemberList(response))
                    });
            }
        });

        return Member;
    }
})();