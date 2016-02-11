(function () {
    var app = angular.module('app', ['ngCookies']);
var test = 0;
    console.log(test);
    app.controller('LoginCtrl', function ($scope, $interval, $rootScope, $cookieStore, $cookies, ParticipantsStore) {
         test = $cookies.ParticipantId;
        $scope.name = test;
        console.log(test);
/*
        $interval(function() {
            $scope.name = $scope.name == 'Ion' ? 'g' : 'Ion'
        }, 2000);
*/

        $scope.FBLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me', function (response) {
                        user = {
                            first_name: response.name.split(" ")[0],
                            last_name: response.name.split(" ")[1],
                            fb_id: response.id
                        };
                        $scope.$apply(function () {
                            ParticipantsStore.addParticipant(user).then(function (data) {
                                $cookieStore.put('ParticipantId', data.id);
                                $scope.name = $scope.name == test ? '' : test
                            });

                        });
                        console.log('Good to see you, ' + response.name + '.');
                        var accessToken = FB.getAuthResponse().accessToken;
                    });

                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
        };
        $scope.$apply.FBLogout = function () {
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(function (response) {
                        document.location.reload();
                        console.log('FB OUT')
                    });

                }
            });
        };
    });

    app.controller('IndexCtrl', function ($scope, $cookies, MessagesStore, $timeout) {
        $scope.messages = [];
        $scope.myId = $cookies.ParticipantId.replace(/"/g, "");
        $scope.getTheMessage = MessagesStore.getMessages($scope.myId).then(function (data) {
            angular.forEach(data, function (item) {
                $scope.messages.push(item.body);
            });

            return $scope.messages;
        });

        setInterval(function () {
            $scope.messages = MessagesStore.getMessages($scope.myId).then(function (data) {
                angular.forEach(data, function (item) {
                    $scope.messages.push(item);
                });

                return $scope.messages;
            });
        }, 2000);
    });

    app.controller('ParticipantsCtrl', function ($scope, ParticipantsStore) {
        $scope.active = [];
        $scope.participants = ParticipantsStore.getParticipants().then(function (data) {
            angular.forEach(data, function (item) {
                    $scope.active.push(item);
            });

            return $scope.active;
        });
    });

    app.controller('FormCtrl', function ($scope, MessagesStore, $cookies) {
        $scope.data = {
            body: null
        };

        $scope.myId = $cookies.ParticipantId.replace(/"/g, "");


        $scope.submit = function () {
            $scope.default = {};
            $scope.reset = function () {
                $scope.form = angular.copy($scope.default);
            };

            MessagesStore.addMessage($scope.myId, $scope.form);
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
//    ------------------FACEBOOK API INIT------------------//
    window.fbAsyncInit = function () {
        FB.init({
            appId: '1533557483610625',
            xfbml: true,
            version: 'v2.5'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
        console.log('FB init');
    }(document, 'script', 'facebook-jssdk'));
})();
