(function () {
    var app = angular.module('app', []);

    var user = [{
        "first_name": "Ionut",
        "last_name": "Firatoiu",
        "fb_id": 1234567890
    }];

    app.controller('LoginCtrl', function ($scope, ParticipantsStore) {/*
        var x= [];
        ParticipantsStore.getParticipants().then(function(item) {
            x = item;
        });
        console.log(x);*/
    });

    app.controller('IndexCtrl', function ($scope) {
        $scope.messages = [];
    });

    app.controller('ParticipantsCtrl', function ($scope) {
        $scope.participants = user;

    });

    app.controller('FormCtrl', function ($scope) {
        $scope.data = {
            body: null
        };

        $scope.submit = function () {
            $scope.default = {};
            $scope.reset = function () {
                $scope.form = angular.copy($scope.default);
            };

            /*MessagesStore.addMessage(id, $scope.form).then(function(messages){
                $scope.messages = messages;
            });*/
            $scope.messages.push($scope.form);
            $scope.reset();
        };
    });


    //create services
    app.factory('ParticipantsStore', function ($http, $q) {
        return (function () {
            var URL = 'http://server.godev.ro:8081/api/participants';

            var getParticipants = function () {
                return $q(function (resolve, reject) {
                    $http({url: URL}).then(function (xhr) {
                            if (xhr.status == 200) {
                                resolve(xhr.data);
                            } else {
                                reject();
                            }
                        },
                        reject
                    );
                });
            };

            var addParticipant = function (data) {
                return $q(function (resolve, reject) {
                    $http({
                        url: URL,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    })
                        .then(
                            function (xhr) {
                                if (xhr.status == 201) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            },
                            reject
                        );
                });
            };

            return {
                getParticipants: getParticipants,
                addParticipant: addParticipant
            };
        });
    });

    app.factory('MessagesStore', function ($http, $q) {
        return (function () {
            var URL = 'http://server.godev.ro:8081/api/messages';

            var getMessages = function (id) {
                return $q(function (resolve, reject) {
                    $http({url: URL + '/' + id}).then(function (xhr) {
                            if (xhr.status == 200) {
                                resolve(xhr.data);
                            } else {
                                reject();
                            }
                        },
                        reject
                    );
                });
            };

            var addMessage = function (id, message) {
                return $q(function (resolve, reject) {
                    $http({
                        url: URL + '/' + id,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(message)
                    })
                        .then(
                            function (xhr) {
                                if (xhr.status == 201) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            },
                            reject
                        );
                });
            };

            return {
                getMessages: getMessages,
                addMessage: addMessage
            };
        });
    });
})();
