usuarioregistradoapp.controller('editarCtrl', ['$stateParams', '$state', '$http', '$scope', '$location', 'ngTableParams', function ($stateParams, $state, $http, $scope, $location, ngTableParams) {
    $scope.selected = false;
    var id = $stateParams.id;

    $http.get('/usuario/ObtenerUsuarioPorID/' + id).success(function (data) {
        $scope.nombre = data.nombre;
        $scope.apellidos = data.apellidos;
        $scope.email = data.email;
        $scope.telefono = data.telefono;
        $scope.loginc = data.login;
        $scope.password = data.password;
        $scope.saldo = data.saldo;
        $scope.urlfoto = data.urlfoto;

        console.log($scope.urlfoto)
    });
    $scope.update = function (nombre, apellidos, email, telefono, loginc, password, saldo, urlfoto) {
        //variables para poder trabajar con archivos
        var formData = new FormData();
        var file = $scope.myFile;
        console.log("El fichero es:", file);
        formData.append("file", file);

        var usuario = {};
        usuario.nombre = nombre;
        usuario.apellidos = apellidos;
        usuario.email = email;
        usuario.telefono = telefono;
        usuario.login = loginc;
        usuario.password = password;
        usuario.saldo = saldo;

        usuario.urlfoto = urlfoto;

        console.log("la foto es:", usuario.urlfoto);

        if (file != undefined){
            $http.put('/usuario/upload/' + usuario.login, formData, {
                    headers: {
                        "Content-type": undefined
                    },
                    transformRequest: angular.identity
                }
                )
                .success(function (data) {

                    $state.go('login');
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

        }

        console.log(usuario);
        $http.put('/usuario/ModificarUsuarioPorID/' + id, usuario)
            .success(function (data) {
                swal(
                    {
                        title: "Actualización de Usuario",
                        text: "Usuario " + usuario.nombre + " " + usuario.apellidos + " actualizado correctamente",
                        imageUrl: '/images/ok.png'
                    }
                );

                $state.go('inicio');
            })
            .error(function (error) {
                swal(
                    {
                        title: "Actualización de Usuario",
                        text: "Error al actualizar el usuario" + usuario.nombre + " " + usuario.apellidos + " ",
                        imageUrl: '/images/error.png'
                    }
                );
            })
    }
}]);


