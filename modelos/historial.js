var mongoose = require('mongoose');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;


var historialEsquema = new Schema({
    logincreador: {type: String},
    logininvitado: {type: String},
    // creador: {type: Schema.ObjectId, ref: 'Usuario'},
    // invitado: {type: Schema.ObjectId, ref: 'Usuario'},
    // ganador: {type: String},
    fecha: {type: String},
    resultadocreador:{type: Number, default: 0},
    resultadoinvitado:{type: Number, default: 0},
    nombremesa:{type: Schema.ObjectId, ref: 'Mesa'},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Historial', historialEsquema);