(function () {
    var app = angular.module('app', ['ngCookies', 'luegg.directives']);
    var errorHandler = function (err) {
        alert(err);
    };

    app.controller('LoginCtrl', function ($scope, $interval, $rootScope, $cookieStore, $cookies, ParticipantsStore) {
        $scope.participantId = '';
        $scope.FBLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me/', function (response) {
                        user = {
                            first_name: response.name.split(" ")[0],
                            last_name: response.name.split(" ")[1],
                            fb_id: response.id
                        };
                        $scope.$apply(function () {
                            ParticipantsStore.addParticipant(user).then(
                                function (data) {
                                    $cookieStore.put('ParticipantId', data.id);
                                    $scope.participantId = $cookieStore.get('ParticipantId');
                                },
                                function () {
                                    errorHandler('Problem at log in. Please try again!');
                                });
                        });
                        console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
        };
        $scope.FBLogout = function () {
            FB.logout(function () {
                document.location.reload()
            });
        };
    });

    app.controller('IndexCtrl', function ($scope, $cookies, MessagesStore, CookieStore) {
        $scope.messages = [];
        $scope.myId = CookieStore.getParticipantCookie($cookies.ParticipantId);

        setInterval(function () {
            MessagesStore.getMessages($scope.myId).then(
                function (data) {
                    $scope.messages = data.reverse();
                },
                function () {
                    errorHandler('Could not get messages history.');
                });
        }, 2000);

    });

    app.controller('ParticipantsCtrl', function ($scope, ParticipantsStore) {
        $scope.active = [];
        $scope.participants = ParticipantsStore.getParticipants().then(
            function (data) {
                $scope.active = data;
            },
            function () {
                errorHandler('Could not get participants.');
            });
    });

    app.controller('FormCtrl', function ($scope, MessagesStore, $cookies, CookieStore) {
        $scope.messages = [];
        $scope.data = {
            body: null
        };
        $scope.myId = CookieStore.getParticipantCookie($cookies.ParticipantId);
        $scope.submit = function () {
            $scope.default = {};
            $scope.reset = function () {
                $scope.form = angular.copy($scope.default);
            };

            MessagesStore.addMessage($scope.myId, $scope.form).then(
                function () {
                },
                function () {
                    errorHandler('Could not send your message.');
                }
            );
            $scope.messages.push($scope.form);
            $scope.reset();
        };
    });

    //create services
    app.factory('CookieStore', function () {
        return (function () {
            var getParticipantCookie = function (cookie) {
                if (cookie) {
                    return cookie.replace(/"/g, "");
                }
            };
            return {
                getParticipantCookie: getParticipantCookie
            }
        })();
    });

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
        })();
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
        })();
    });
//---------------------------------TEXTAREA ON ENTER-----------------------------------//

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})();
