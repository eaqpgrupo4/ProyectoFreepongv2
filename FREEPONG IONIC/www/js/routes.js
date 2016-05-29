angular.module('freepong.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('freepong', {
      url: '/freepong',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('freepong.notificaciones', {
      url: '/notificaciones',
      views: {
        'menuContent': {
         templateUrl: 'templates/notificaciones.html'
        }
      }
    })
    .state('freepong.home', {
      url: '/home',
      views: {
        'menuContent': {
         templateUrl: 'templates/home.html',
         controller: 'HomeController'
        }
      }
    })
    .state('freepong.amigos', {
      url: '/amigos',
      views: {
        'menuContent': {
         templateUrl: 'templates/amigos.html'
        }
      }
    })
    .state('freepong.resultados', {
      url: "/resultados",
      views: {
        'menuContent' :{
          templateUrl: "templates/resultados.html",
          controller: 'ResultadosController'
        }
      }
    })
    .state('freepong.historial', {
      url: "/historial",
      views: {
        'menuContent' :{
          templateUrl: "templates/historial.html",
          controller: 'HistorialController'
        }
      }
    })
    .state('freepong.crearPartida', {
      url: "/crearPartida",
      views: {
        'menuContent' :{
          templateUrl: "templates/crearPartida.html",
          controller: 'CrearPartidaController'
        }
      }
    })
    .state('freepong.miPerfil', {
      url: "/miPerfil",
      views: {
        'menuContent' :{
          templateUrl: "templates/miperfil.html",
          controller: 'MiPerfilController'
        }
      }
    })
    .state('freepong.posicion', {
      url: '/posicion',
      views: {
         'menuContent': {
          templateUrl: 'templates/posicion.html',
          controller: 'PosicionController'
        }
      }
    })
    .state('freepong.registro', {
      url: '/registro',
      views: {
        'menuContent': {
         templateUrl: 'templates/registro.html',
         controller: 'registroController'
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('freepong.logout', {
      url: '/logout',
      views: {
        'menuContent': {
         templateUrl: 'templates/logout.html',
         controller: 'LogoutController'
        }
      }
    })
    .state('freepong.perfil', {
      url: '/perfil/:id',
      views: {
      'menuContent': {
        templateUrl: 'templates/perfil.html',
        controller: 'PerfilController'
        }
      }
    })
    .state('freepong.usuarios', {
      url: '/usuarios',
        views: {
         'menuContent': {
          templateUrl: 'templates/usuarios.html',
          controller: 'UsuariosController'
        }
      }
    })
    .state('freepong.findamigos', {
      url: '/findamigos',
        views: {
         'menuContent': {
          templateUrl: 'templates/findamigos.html',
          controller: 'UsuariosController'
        }
      }
    })
    .state('freepong.mesas', {
      url: '/mesas',
      views: {
      'menuContent': {
        templateUrl: 'templates/mesas.html',
        controller: 'MesasController'
        }
      }
    })
    .state('freepong.partidas', {
      url: '/partidas',
      views: {
      'menuContent': {
        templateUrl: 'templates/partidas.html',
        controller: 'PartidasController'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});