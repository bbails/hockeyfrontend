const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

const gameController = new GameController();

router.get('/', gameController.renderRink.bind(gameController));
router.post('/shot', gameController.processShot.bind(gameController));
router.get('/shots', gameController.getShots.bind(gameController));
router.delete('/shots', gameController.clearShots.bind(gameController));

module.exports = router;