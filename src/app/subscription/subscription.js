(function () {
    'use strict';

    angular
        .module('cdmf.subscription', [
            'cdmf.hal'
        ])
        .constant('SUBSCRIPTION_URL', '/management/subscription${subscriptionId}')
        .service('Subscription', Subscription);

    function Subscription(
        $q,
        hal,
        SUBSCRIPTION_URL
    ) {

        function Subscription(resource) {
            var subscription = {};

            _.extend(subscription, {
                id: resource.id,
                number: resource.number,
                firstname: resource.firstname,
                lastname: resource.lastname,
                email: resource.email,
                member: resource.member
            });

            return subscription;
        }

        function SubscriptionDeleteResult(resource) {
            return resource;
        }


        function fromSubscriptionList(response) {
            return _.map(response.data.subscriptionList, function (subscription) {
                return new Subscription(subscription);
            });
        }

        _.extend(Subscription, {
            getAll: function () {
                var url = _.template(SUBSCRIPTION_URL);

                return hal
                    .get(url({'subscriptionId': ''}))
                    .then(function (response) {
                        return $q.resolve(fromSubscriptionList(response));
                    });
            },
            unsubscribe: function (subscription) {
                var url = _.template(SUBSCRIPTION_URL);

                return hal
                    .delete(url({'subscriptionId': '/' + subscription.id}))
                    .then(function (response) {
                        return $q.resolve(response).then(function (response) {
                            return new SubscriptionDeleteResult(response.data)
                        });
                    });
            }
        });

        return Subscription;
    }
})();