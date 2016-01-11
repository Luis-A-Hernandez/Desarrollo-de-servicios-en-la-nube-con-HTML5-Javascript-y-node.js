// Definición del modelo de Comments con validación

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Comment', 
		{
			texto: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						msg : "-> Introduce tu comentario"
					}
				}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}
	);
}