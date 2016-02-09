var app = angular.module('app', []);

app.controller('LoginCtrl', function ($scope) {
    $scope.participants=[];

});

app.controller('ChatCtrl', function ($scope) {
    $scope.messages = [];


});

app.controller('ParticipantsCtrl', function ($scope) {

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

        /*TransactionStore.add($scope.form);*/
        $scope.reset();
    };
});