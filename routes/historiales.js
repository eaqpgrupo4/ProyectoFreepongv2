module.exports = function (app) {
    var _base = "http://localhost:3000";
    var mongoose = require('mongoose');
    var Historial = require('../modelos/historial.js');
    var Mesa = require('../modelos/mesa.js');
    var Usuario = require('../modelos/usuario.js');



    // ObtenerHistorialesL= function (req, res){
    //     console.log('GET/ObtenerHistorialesLogin/'+ req.params.login);
    //     Historial.find({$or:[{logincreador:req.params.login},{logininvitado:req.params.login}]},function (err, historiales){
    //         if (err) return res.send(500, err.message);
    //             console.log(historiales);
    //             res.status(200).jsonp(historiales);
    //         });
    // };

    // ObtenerHistorialesL= function (req, res){
    //     console.log('GET/ObtenerHistorialesLogin/max');
    //     Historial.find({$or:[{logincreador:'max'},{logininvitado:'max'}]},function (err, historiales){
    //         if (err) return res.send(500, err.message);
    //             console.log(historiales);
    //             res.status(200).jsonp(historiales);
    //         });
    // };
     //GET - Obtner usuario a partir de el ID
    ObtenerusuarioporLogin = function (req, res) {
        Usuario.find({login: req.params.login}, function (err, usuario) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(usuario);
        });
    };

    ObtenerHistorialesL2= function (req, res){
        console.log('GET/ObtenerHistorialesLogin2/' + req.query.login);
        Historial.find({$or:[{logincreador:req.query.login},{logininvitado:req.query.login}]},function (err, historiales){
            if (err) return res.send(500, err.message);
                console.log(historiales);
                Mesa.populate(historiales, {path: "nombremesa"},function(err, historiales){
                    res.status(200).jsonp(historiales);    
                });
            });
    };

    ObtenerHistorialesL= function (req, res){
        console.log('GET/ObtenerHistorialesLogin/' + req.params.login);
        Historial.find({$or:[{logincreador:req.params.login},{logininvitado:req.params.login}]},function (err, historiales){
            if (err) return res.send(500, err.message);
                console.log(historiales);
                Mesa.populate(historiales, {path: "nombremesa"},function(err, historiales){
                    res.status(200).jsonp(historiales);    
                });
            });
    };

    ObtenerHistorialesP = function (req, res) {

        console.log(req.query.login);

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

        Historial
            .find({$or:[{logincreador:req.query.login},{logininvitado:req.query.login}]})
            .filter(filter)
            .order(sort)
            .page(pagination, function (err, historiales) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    console.log(historiales);
                    res.jsonp(historiales);
                }
            });


    };

    app.get('/historial/ObtenerHisorialesPaginados', ObtenerHistorialesP);
    app.get('/historial/ObtenerHisorialesLogin2', ObtenerHistorialesL2);
    app.get('/historial/ObtenerHistorialesLogin/:login/', ObtenerHistorialesL);
    app.get('/historial/ObtenerusuarioporLogin/:login/', ObtenerusuarioporLogin);

}
