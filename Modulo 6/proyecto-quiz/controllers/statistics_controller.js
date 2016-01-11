var models = require('../models/models.js');

exports.index = function(req,res) {

	// Inicializamos el objeto estadisticas
	statistics = {
		quiz: {
			number: 0,
			widthComments: 0,
			widthoutComments: 0
		},
		comments: {
			number: 0,
			average: 0
		}
	};

	models.Quiz.findAll({include: [models.Comment]})
	.then(function(quizes){
		for (var index = 0, len = quizes.length; index < len; index++) {
  			var q = quizes[index];
			statistics.quiz.number++;
			console.log(q.Comments.length);
			console.log('<---------------------------- consulta del numero de comentarios')
			if (q.Comments.length > 0){
				statistics.comments.number += q.Comments.length;
				statistics.quiz.widthComments++;
			} else {
				statistics.quiz.widthoutComments++;
			}
		}
		console.log('<-----------------------------------------------------------------');
		statistics.comments.average = (statistics.comments.number > 0) ? (statistics.comments.number / statistics.quiz.number) : 0;
		res.render('statistics/index', {statistics: statistics, errors:[]});
	});

};