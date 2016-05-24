usuarioregistradoapp.controller('usuarioregistradoctrl', ['$state', '$http', '$scope', '$cookies','$window', function ($state, $http, $scope, $cookies, $window) {
    var Urlactual=$window.location;
    var userData=Urlactual.href.split("?");
    var username=userData[2].split("#/");
    var login= username[0];
    var IDuser = userData[1];
    var estado= new Boolean();

    $scope.login = login;
    $scope.editar = function () {
        $state.go('editar', {
            id: IDuser
        });
    };
    $scope.vermesas = function () {
        $state.go('mesas', {
            IDuser: IDuser,
            login: login
        });
    };
    $scope.resultados = function () {
        $state.go('insertarresultados', {
             login: login
        });
    };
    $scope.historial = function () {
        $state.go('historial', {
            login: login
        });
    };
    $scope.chat = function () {

        $state.go('chat', {
            IDuser: IDuser,
            login: login
        });
    };


}]);
