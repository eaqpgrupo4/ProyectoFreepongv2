var express = require("express"),// Express: Framework HTTP para Node.js
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'), // Mongoose: Libreria para conectar con MongoDB
    path = require('path'),
    cookieParser = require('cookie-parser'),
    formidable = require('formidable'),
    cors = require('cors');
    require('mongoose-middleware').initialize(mongoose);

// Conexión a la base de datos de MongoDB que tenemos en local freepong67
mongoose.connect('mongodb://127.0.0.1:27017/freepong67', function (err, res) {
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(__dirname + '/public'));


app.use(passport.initialize());
app.use(passport.session());

//API rutas
routes = require('./routes/usuarios')(app);
routes = require('./routes/partidas')(app);
routes = require('./routes/mesas')(app);
routes = require('./routes/historiales')(app);


var router = express.Router();
var server = require('http').Server(app);


app.use(router);



app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['public_profile', 'email']}));
app.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect: '/'}),function(req,res){
        console.log('3333333333333333333'+req.user);
        res.redirect('/usuarioregistradoapp/usuarioregistrado.html?' + req.user._id+ '?'+ req.user.login);
    });

app.get('/auth/twitter', passport.authenticate('twitter',{scope: ['public_profile']}));
app.get('/auth/twitter/callback',passport.authenticate('twitter',{failureRedirect: '/'}),function(req,res){
        console.log('3333333333333333333'+req.user);
        res.redirect('/usuarioregistradoapp/usuarioregistrado.html?' + req.user._id+ '?'+ req.user.login);
    });

var Usuario = require('./modelos/usuario.js');
var usuariosactivos =[];

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket)
{
    console.log('Alguien ha abierto un socket')
    socket.on('enviar mensaje', function (mensaje){
        console.log('mensaje recibido');
        io.sockets.emit('recibir mensaje', mensaje);
        console.log('mensaje enviado');
    });
    socket.on('nuevo usuario', function (IDuser){
        console.log('Nuevo usuario');
        Usuario.findById(IDuser, function (err, usuario)
        {
            socket.usuario = usuario;
            usuariosactivos.push(usuario);
            mostrarlogin(usuariosactivos);
            io.sockets.emit('actualizarusuariosactivos', usuariosactivos);
            console.log('actualizarusuariosactivos 76');
            console.log()
        });
    });

    socket.on('damesusariosactivos', function(){
        console.log('dame ususarios activos');
        io.sockets.emit('actualizarusuariosactivos', usuariosactivos);
        console.log('actualizarusuariosactivos 81');
    });
    socket.on('disconnect', function() {
        console.log('eliminado usuario');

        usuariosactivos.splice(usuariosactivos.indexOf(socket.usuario), 1);

        io.sockets.emit('actualizarusuariosactivos',usuariosactivos);
        console.log('actualizarusuariosactivos 89');
    });


});
server.listen(3000, function () {
    console.log("Servidor escuchando en, http://localhost:3000");
});
mostrarlogin = function(usuariosactivos){
    var i=0;
    while(i<usuariosactivos.length){
        console.log(usuariosactivos[i].login)
        i++;
    }
}
