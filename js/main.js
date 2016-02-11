(function () {
    var app = angular.module('app', ['ngCookies']);

    app.controller('LoginCtrl', function ($scope, $rootScope, $cookieStore, $cookies, ParticipantsStore) {
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
                            });

                            $scope.cookie = function() {
                                $rootScope.$broadcast('cookieId', function(val) {
                                    $cookies.ParticipantId = val;
                                    console.log(val);
                                });
                            };
                        });
                        console.log('Good to see you, ' + response.name + '.');
                        var accessToken = FB.getAuthResponse().accessToken;
                    });

                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
        };
        $scope.$apply.FBLogout = function(){
            FB.getLoginStatus(function(response) {
                if (response && response.status === 'connected') {
                    FB.logout(function(response) {
                        document.location.reload();
                        console.log('FB OUT')
                    });

                }
            });
        };
    });

    app.controller('IndexCtrl', function ($scope) {
        $scope.messages = [];
    });

    app.controller('ParticipantsCtrl', function ($scope, ParticipantsStore) {
        $scope.active = [];
        $scope.participants = ParticipantsStore.getParticipants().then(function(data){
            angular.forEach(data, function(item){
               angular.forEach(item, function() {
                   $scope.active.push(item);
               });
            });

            return $scope.active;
        });
    });

    app.controller('FormCtrl', function ($scope, MessagesStore) {
        $scope.data = {
            body: null
        };

        $scope.$on('cookieId', function(e, val) {
            $scope.cookie = val;
            console.log($scope.cookie);
        });

        console.log($scope.cookie);

        $scope.submit = function () {
            $scope.default = {};
            $scope.reset = function () {
                $scope.form = angular.copy($scope.default);
            };

            MessagesStore.addMessage($scope.cookie, $scope.form);
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
