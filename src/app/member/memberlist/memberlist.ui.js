(function () {
    angular
        .module('cdmf.member.memberlist.ui', [
            'cdmf.member'
        ])
        .controller('MemberlistController', MemberlistController)
        .component('cdmfMemberlist', {
            templateUrl: 'app/member/memberlist/memberlist.html',
            controller: 'MemberlistController',
            controllerAs: 'vm'
        });

    function MemberlistController(
        Member
    ) {
        var vm = this;


        _.extend(vm, {
            filterText: '',
            members: [],
            filteredMembers: []
        });

        _.extend(vm, {
            filterMemberlist: filterMemberlist
        });

        Member.getAll().then(function (members) {
            vm.members = members;
            vm.filteredMembers = members;
        });

        function filterMemberlist() {
            vm.filteredMembers = _.filter(vm.members, function (member) {
                return _.includes(_.toString(member.number), vm.filterText) ||
                    _.includes(member.firstname, vm.filterText) ||
                    _.includes(member.lastname, vm.filterText);
            });
        }
    }
})();