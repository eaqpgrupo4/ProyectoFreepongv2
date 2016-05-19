var express = require("express"),// Express: Framework HTTP para Node.js
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'), // Mongoose: Libreria para conectar con MongoDB
logger = require('morgan'),
path = require('path'),
favicon = require('serve-favicon'),
crypto = require('crypto'),
cookieParser = require('cookie-parser'),
formidable = require('formidable'),
cors = require('cors');
require('mongoose-middleware').initialize(mongoose);

// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://127.0.0.1:27017/freepong', function (err, res) {
    if (err) throw err;
    console.log('Conectado correctamente a la Base de Datos');
});
var app = express();
var passport = require('passport');
var session = require('express-session');
require('./modelos/usuario');
require('./config/passport')(passport);
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Iniciamos la aplicación Express

// Configuración (sistema de plantillas, directorio de vistas,...)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));


app.use(bodyParser({uploadDir:'./images'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());


// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(__dirname + '/public'));
//app.use('/bower_components',  express.static(__dirname + '/bower_components'));





// Configuracion de Passport. Lo inicializamos y le indicamos que Passport maneje la Sesion
//app.use(session({ secret: 'zasentodalaboca' }));
app.use(passport.initialize());
app.use(passport.session());

//API rutas
routes = require('./routes/usuarios')(app);
routes = require('./routes/partidas')(app);
routes = require('./routes/mesas')(app);
routes = require('./routes/historiales')(app);


var router = express.Router();
var server = require('http').Server(app);

var io   = require('socket.io')(server);
app.use(router);



app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
    {
       failureRedirect: '/'
    }),
    function(req,res)
    {
        console.log('3333333333333333333'+req.user);
        res.redirect('/usuarioregistradoapp/usuarioregistrado.html?' + req.user._id+ '?'+ req.user.login);
    });
app.get('*', function(req, res) {res.sendfile('./public/index.html');});

var onlineUsers = [];
io.on('connection', function(socket) {

    console.log('New user connected');

    /**
     * Cada nuevo cliente solicita con este evento la lista
     * de usuarios conectados en el momento.
     */
    socket.on('all online users', function () {
        socket.emit('all online users', onlineUsers);
    });

    /**
     * Cada nuevo socket debera estar a la escucha
     * del evento 'chat message', el cual se activa
     * cada vez que un usuario envia un mensaje.
     *
     * @param  msg : Los datos enviados desde el cliente a
     *               través del socket.
     */
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    /**
     * Mostramos en consola cada vez que un usuario
     * se desconecte del sistema.
     */
    socket.on('disconnect', function() {
        onlineUsers.splice(onlineUsers.indexOf(socket.user), 1);
        io.emit('remove user', socket.user);
        console.log('User disconnected');
    });

    /**
     * Cuando un cliente se conecta, emite este evento
     * para informar al resto de usuarios que se ha conectado.
     * @param  {[type]} nuser El nuevo usuarios
     */
    socket.on('new user', function (nuser) {
        socket.user = nuser;
        onlineUsers.push(nuser);
        io.emit('new user', nuser);
    });

});
server.listen(3000, function () {
    console.log("Servidor escuchando en, http://localhost:3000");
});
