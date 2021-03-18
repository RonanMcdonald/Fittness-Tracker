const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

// --- Routes --- //
router.get("/dashboard", controller.index);
// Add new goal
router.get('/new', controller.addGoal); 
router.post('/new', controller.post_new_entry);
// Update goal
router.get('/decrement/:_id', controller.decrement);
//router.post('/decrement/:_id', controller.post_decrement);

router.get('/increment/:_id', controller.increment);
//router.post('/increment/:_id', controller.post_increment);

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => { return res.status(404).send("Error 404 : Page Not Found"); });
// 500 - Any server error
router.use((req, res, next) => { return res.status(500).send("Error 500 : Internal Server Error") });

module.exports = router;