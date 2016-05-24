var socket = io ({forceNew: true});
usuarioregistradoapp.controller('vistachatctrl', ['$stateParams', '$state', '$http', '$scope',function ($stateParams, $state, $http, $scope){

    var IDuser = $stateParams.IDuser;
    var login = $stateParams.login;


   $http.get('/usuario/ObtenerUsuarioPorID/' + IDuser).success(function (data) {$scope.userlocal=data;});

    socket.emit('nuevo usuario', IDuser);
    socket.emit('dameusuriaosactivos');
    socket.on('actualizarusuariosactivos', function (data){
       console.log(data);
       $scope.$apply(function ()
       {
           $scope.usuariosactivos = data;
       });
   });
    socket.on('chat mensaje', function (mensaje){});
    $scope.enviarmensaje = function (mensaje){
       socket.emit('chat message', mensaje);};
    $scope.$on('$destroy', function (event) {
        socket.disconnect();

    });
}]);
