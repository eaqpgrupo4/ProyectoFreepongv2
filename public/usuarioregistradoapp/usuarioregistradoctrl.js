var socket = io ({forceNew: true});
usuarioregistradoapp.controller('usuarioregistradoctrl', ['$state', '$http', '$scope', '$cookies','$window', function ($state, $http, $scope, $cookies, $window) {
    var Urlactual=$window.location;
    var userData=Urlactual.href.split("?");
    var username=userData[2].split("#/");
    var login= username[0];
    var IDuser = userData[1];
    var mensajes=  new Array();


    $scope.uid=login;

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


    $http.get('/usuario/ObtenerUsuarioPorID/' + IDuser).success(function (data) {$scope.userlocal=data;});
    console.log('nuevo socket')

    socket.emit('nuevo usuario', IDuser);
    socket.emit('dameusuriaosactivos');
    socket.on('actualizarusuariosactivos', function (data){
        console.log(data);
        $scope.$applyAsync(function ()
        {
            $scope.usuariosactivos = data;
        });
    });

    $scope.enviarmensaje=function(){
        console.log('entro enviar');

        if($scope.send_text==""){
            alert("Message can't be empty.");
        }
        else{
            var mensaje = (
            {
                msg:$scope.send_text,
                login: login,
                timestamp:Math.floor(new Date() / 1000)

            });
            console.log('entro ');
            socket.emit('enviar mensaje', mensaje);

            $scope.send_text="";


        }
    };
    socket.on('recibir mensaje',function(mensaje){
            mensajes.push(mensaje);
        console.log(mensaje);

        $scope.$applyAsync(function () {

            $scope.mensajes = mensajes;

        });


    });
}]);
