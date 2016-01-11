// Definición del modelo Quiz

module.exports = function (secuelize, DataTypes) {
	return secuelize.define('Quiz', 
	{	pregunta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "Falta pregunta"}}
		},
		respuesta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "Falta respuesta"}}
		},
		tema: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "Falta tema"}}
		},

	});
}