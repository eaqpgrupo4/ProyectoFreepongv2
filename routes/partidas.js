/**
 * Created by raul on 3/4/16.
 */

module.exports = function (app) {


    var mongoose = require('mongoose');
    var Partida = require('../modelos/partida.js');
    var Usuario = require('../modelos/usuario.js');
    var Historial= require('../modelos/historial.js');
    var Mesa = require('../modelos/mesa.js');
    //GET - Obtener todas las partidas de la colecccion partidas de la BBDD
    ObtenerPartidas = function (req, res) {
        Partida.find({},function (err, partidas) {
            if (err) res.send(500, err.message);
            console.log('GET /partidas')
            Mesa.populate(partidas, {path: "IDmesa"},function(err, partidas){
                res.status(200).jsonp(partidas);    
            });
        });
    };

    CrearPartida = function (req, res, next) {
        console.log('Crear partida/ IDmesa:' + req.body.IDmesa + 'Fecha partida:' + req.body.FechaPartida + 'horario+ ' + req.body.horario)
        eval('var partida = new Partida({IDmesa: req.body.IDmesa,FechaPartida:req.body.FechaPartida,' + req.body.horario + ':{creador:{_id: req.body.IDcreador, login:req.body.login},invitado:{_id: null, login:null},estadopartida:1}});');
        partida.save(function (err) {
            if (err) return res.send(500, err.message);
            Mesa.populate(partida, {path: "IDmesa"},function(err, partida){
                res.status(200).jsonp(partida);    
            });
        });
    };

    ObtenerPartidaporID = function (req, res) {
        Partida.findById(req.params.id, function (err, partida) {
            if (err) return res.send(500, err.message);
            console.log('GET /partida/' + req.params.id);
            Mesa.populate(partida, {path: "IDmesa"},function(err, partida){
                res.status(200).jsonp(partida);    
            });
        });
    };

    //PUT Añadir usuario invitado a una partida creada ID
    UnirsePartidaporID = function (req, res) {
        var hora = req.body.horario;
        console.log('Put/UnirsePartida/' + req.body.IDinvitado)
        Partida.findById(req.params.id, function (err, partida) {
            console.log(partida);
            eval('partida.' + hora + '.invitado._id = req.body.IDinvitado;');
            eval('partida.' + hora + '.invitado.login = req.body.login;');
            eval('partida.' + hora + '.estadopartida =2;');
            partida.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(partida);
            });
        });
    };

    AsignarHoraPartidaporID = function (req, res) {
        var hora = req.body.horario;
        console.log('Put/AsignarHoraPartidaporID')
        Partida.findById(req.params.id, function (err, partida) {
            var entidad = (
            {
                creador: {_id: req.body.IDcreador, login: req.body.login},
                invitado: {_id: null, login: null},
                estadopartida: 1
            });
            eval('partida.' + req.body.horario + '= entidad;');
            partida.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(partida);
            });
        });
    };

    //DELETE - Eliminar partida v2
    EliminarPartidaporID = function (req, res) {
        console.log('DELETE partida');
        console.log(req.params.id);
        Partida.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.send(err)
            }
            res.json({message: 'Partida eliminada correctamente'});
        })
    };

    //GET Obtener todos las partidas de la colecccion partidas paginado
    ObtenerPartidasP = function (req, res) {
        console.log('post /obtenerpartidasP');
        var sort;
        var sortObject = {};
        var count = req.query.count || 5;
        var page = req.query.page || 1;

        var filter = {
            filters: {
                mandatory: {
                    contains: req.query.filter
                }
            }
        };
        var pagination = {
            start: (page - 1) * count,
            count: count
        };

        if (req.query.sorting) {
            var sortKey = Object.keys(req.query.sorting)[0];
            var sortValue = req.query.sorting[sortKey];
            sortObject[sortValue] = sortKey;
        }
        else {
            sortObject.desc = '_id';
        }

        sort = {
            sort: sortObject
        };

        Partida
            .find()
            .filter(filter)
            .order(sort)
            .page(pagination, function (err, partidas) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(partidas);
                }
            });

    };

    ObtenerPartidaPorFechaymesa = function (req, res) {
        console.log('GET/ObtenerPartidaPorFechaymesa/'+ req.params.IDmesa + '/' + req.params.fechapartida);
        Partida.find({ IDmesa: req.params.IDmesa, FechaPartida: req.params.fechapartida }, function (err, partida) {
            if (err) return res.send(500, err.message);
            Mesa.populate(partida, {path: "IDmesa"},function(err, partida){
                res.status(200).jsonp(partida);    
            });
        });
    };
    ObtenerPartidasconestadodos= function (req, res){
        //console.log('GET/ObtenerPartidasconestadodos/'+ req.params.login);
        Partida.find({$or:[ {$and:[{'P1.creador.login' : req.params.login},{'P1.estadopartida':2}]},
                            {$and:[{'P2.creador.login' : req.params.login},{'P2.estadopartida':2}]},
                            {$and:[{'P3.creador.login' : req.params.login},{'P3.estadopartida':2}]},
                            {$and:[{'P4.creador.login' : req.params.login},{'P4.estadopartida':2}]},
                            {$and:[{'P5.creador.login' : req.params.login},{'P5.estadopartida':2}]},
                            {$and:[{'P6.creador.login' : req.params.login},{'P6.estadopartida':2}]},
                            {$and:[{'P7.creador.login' : req.params.login},{'P7.estadopartida':2}]},
                            {$and:[{'P8.creador.login' : req.params.login},{'P8.estadopartida':2}]},
                            {$and:[{'P9.creador.login' : req.params.login},{'P9.estadopartida':2}]},
                            {$and:[{'P10.creador.login' : req.params.login},{'P10.estadopartida':2}]},
                            {$and:[{'P11.creador.login' : req.params.login},{'P11.estadopartida':2}]},
                            {$and:[{'P12.creador.login' : req.params.login},{'P12.estadopartida':2}]}]},function (err, partidas){
                            if (err) return res.send(500, err.message);
                            console.log(partidas);
                            Mesa.populate(partidas, {path: "IDmesa"},function(err, partidas){
                                res.status(200).jsonp(partidas);    
                            });
                        });

    };
    InsertartarResultadosporID= function (req, res){
        console.log('GET/InsertartarResultadosporID/'+ req.params.IDpartida);

        Partida.findById(req.params.IDpartida, function (err, partida) {

            eval('var entidad=partida.'+req.body.horario+';');
            entidad.estadopartida=3;
            entidad.creador.juegosganados=req.body.juegoscreador;
            entidad.invitado.juegosganados=req.body.juegosinvitado;
            // if (entidad.creador.juegosganados > entidad.invitado.juegosganados){
            //     entidad.creador.puntuacion = entidad.creador.puntuacion + 3;
            // }
            // else if (entidad.creador.juegosganados < entidad.invitado.juegosganados){
            //     entidad.invitado.puntuacion = entidad.invitado.puntuacion + 3;
            // }
            // else {
            //     entidad.creador.puntuacion = entidad.creador.puntuacion;
            //     entidad.invitado.puntuacion = entidad.invitado.puntuacion;
            // }

            idusercreador=entidad.creador._id;
            iduserinvitado=entidad.invitado._id;

            logincreador=entidad.creador.login;
            logininvitado=entidad.invitado.login;
            fechapartida=partida.FechaPartida;
            nombremesa=partida.IDmesa;

            eval('partida.' + req.body.horario + '= entidad;');
            console.log(partida);
            partida.save(function (err)
            {
                if (err){return res.send(500, err.message);
                }
                else{

                    res.status(200).jsonp(partida);
                    Usuario.findById(idusercreador, function (err, usuario) {
                        usuario.pjugados= (usuario.pjugados + (req.body.juegoscreador+req.body.juegosinvitado));
                        usuario.pganados=(usuario.pganados + req.body.juegoscreador);
                        usuario.puntuacion=(usuario.pganados/usuario.pjugados)*100;
                        console.log('nuevo registro'+ usuario);
                        usuario.save(function (err) {
                            if (err){console.log('error al añadir resultado');}
                            else{console.log('añadir resultado bien');}
                        });

                    });
                    Usuario.findById(iduserinvitado, function (err, usuario) {
                        usuario.pjugados= (usuario.pjugados + (req.body.juegoscreador+req.body.juegosinvitado));
                        usuario.pganados=(usuario.pganados + req.body.juegosinvitado);
                        usuario.puntuacion=(usuario.pganados/usuario.pjugados)*100;
                        console.log('nuevo registro'+ usuario);
                        usuario.save(function (err) {
                            if (err){console.log('error al añadir resultado');}
                            else{console.log('añadir resultado bien');}
                        });

                    });
                    var historial = new Historial({
                        logincreador: logincreador,
                        logininvitado: logininvitado,
                        fecha:fechapartida,
                        resultadocreador:req.body.juegoscreador,
                        resultadoinvitado:req.body.juegosinvitado,
                        nombremesa:nombremesa
                    });
                    historial.save(function (err, historial) {
                        if (err){console.log('error al añadir hisorial');}
                        else{console.log('añadir historial bien');}
                    });
                }

            });



        });

    }
    //ENDPOINTS
    app.post('/partida/CrearPartida', CrearPartida);
    app.put('/partida/insertartarresultados/:IDpartida', InsertartarResultadosporID);
    app.put('/partida/UnirsePartida/:id', UnirsePartidaporID);
    app.put('/partida/AsignarHoraPartidaporID/:id', AsignarHoraPartidaporID);
    app.get('/partida/ObtenerPartidas', ObtenerPartidas);
    app.get('/partida/ObtenerPartidasPaginadas', ObtenerPartidasP);
    app.get('/partida/ObtenerPartidaPorID/:id', ObtenerPartidaporID);
    app.get('/partida/ObtenerPartidaPorFechaymesa/:IDmesa/:fechapartida', ObtenerPartidaPorFechaymesa);
    app.get('/partida/ObtenerPartidasconestadodos/:login', ObtenerPartidasconestadodos);
    app.delete('/partida/EliminarPartidaPorID/:id', EliminarPartidaporID);

}
