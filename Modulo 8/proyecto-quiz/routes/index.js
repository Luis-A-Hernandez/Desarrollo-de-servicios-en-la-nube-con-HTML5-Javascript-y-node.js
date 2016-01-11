var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

// AutoLoads
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Rutas principales 
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[] });
});
router.get('/author', function(req, res){
	res.render('autor', {errors: []});
});


// Ruta Quizes uso
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show); // quizController.show
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Ruta Quizes edición
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);


// Rutas Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.post('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', commentController.publish);


// Rutas Login
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.delete('/login', sessionController.destroy);


// Rutas de estadísticas
router.get('/statistics', statisticsController.index);
module.exports = router;
