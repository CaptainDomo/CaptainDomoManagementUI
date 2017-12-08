(function () {
    'use strict';

    angular
        .module('cdmf.subscriptionlist.ui', [
            'cdmf.subscription'
        ])
        .controller('SubscriptionlistController', SubscriptionlistController)
        .component('cdmfSubscriptionlist', {
            controller: 'SubscriptionlistController',
            controllerAs: 'vm',
            templateUrl: 'app/subscription/subscriptionlist/subscriptionlist.html'
        });

    function SubscriptionlistController(
        Subscription
    ) {
        var vm = this;

        _.extend(vm, {
            filterText: '',
            filteredSubscriptions: [],
            subscriptions: [],
            subscriptionDeleteResult: undefined
        });

        _.extend(vm, {
            filterSubscriptionlist: filterSubscriptionlist,
            unsubscribe: unsubscribe
        });

        Subscription
            .getAll()
            .then(function (subscriptions) {
                vm.subscriptions = subscriptions;
                vm.filteredSubscriptions = subscriptions;
            });


        function filterSubscriptionlist() {
            vm.filteredSubscriptions = _.filter(vm.subscriptions, function (subscription) {
                return _.includes(_.toString(subscription.number), vm.filterText) ||
                    _.includes(subscription.firstname, vm.filterText) ||
                    _.includes(subscription.lastname, vm.filterText) ||
                    _.includes(subscription.email, vm.filterText);
            });
        }

        function unsubscribe(subscription) {
            Subscription
                .unsubscribe(subscription)
                .then(function (subscriptionDeleteResult) {
                    vm.subscriptionDeleteResult = subscriptionDeleteResult;

                    if (vm.subscriptionDeleteResult.subscriptionDeleteResultCode === 'SUCCESSFUL') {
                        vm.subscriptions = _.reject(vm.subscriptions, {'id': subscription.id});
                        vm.filteredSubscriptions = _.reject(vm.filteredSubscriptions, {'id': subscription.id});
                    }
                });
        }
    }
})();