
var mongoose = require('mongoose');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var usuarioEsquema = new Schema({
    nombre: {type: String},
    apellidos: {type: String},
    email: {type: String},
    telefono: {type: String},
    login: {type: String},
    password: {type: String},
    //rol: {type: String},
    provider_id: {type: String},
    urlfoto: {type: String, default:'/images/default-profile.png'},
    saldo: {type: Number, default: 0},
    created: {type: Date, default: Date.now},
    pjugados:{type: Number, default: 0},
    pganados:{type: Number, default: 0},
    puntuacion:{type: Number, default: 0}
});

module.exports = mongoose.model('Usuario', usuarioEsquema);