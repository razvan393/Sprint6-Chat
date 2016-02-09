(function () {
    var app = angular.module('app', []);

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

            var addMessage = function (id,message) {
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