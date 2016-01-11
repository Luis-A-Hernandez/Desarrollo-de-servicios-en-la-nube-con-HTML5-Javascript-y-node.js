var models = require('../models/models.js');

// Autoload (Middelware principal)

exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(
		function(quiz)	{
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch (function(error) {next(error);});
};


exports.index = function(req, res, next) {

	if (!req.query.tema || req.query.tema === "undefined"){
		req.query.tema="";
	}

	var search = {};
	if (req.query.search) {
		search = {
			pregunta: {
				like: "%" + req.query.search.replace(" ", '%') + "%"
			}
		}
	};
	if (req.query.tema) {
		search = {
			tema: {
				like: "%" + req.query.tema.replace(" ", '%') + "%"
			}
		}
	};
	var consulta = {
		order: [
			['pregunta','ASC']
		],
		where: search
	};
	models.Quiz.findAll(consulta).then(function(quizes){
		res.render('quizes/index', {quizes: quizes, tema: req.query.tema , errors:[]});
	});
};


exports.new = function(req, res) {
	var quiz = models.Quiz.build(
			{pregunta:"pregunta", respuesta:"respuesta", tema:"otro"}
		);
	res.render('quizes/new', {quiz:quiz, errors:[]});
};


exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );
	quiz
	.validate().then(function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			quiz
			.save({fields: ["pregunta","respuesta","tema"]})
			.then(function(){res.redirect('/quizes');
	});
		}
	})
};

exports.show = function(req,res) {
	res.render('quizes/show', {quiz: req.quiz, errors:[]});	
};


exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	};
	res.render('quizes/answer', {respuesta: resultado, quiz: req.quiz, errors:[]});
};


exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz: quiz, errors:[]});
};


exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;



	req.quiz.validate()
	.then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz
			.save({fields:["pregunta","respuesta","tema"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	});
};
