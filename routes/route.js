// --- Initialization --- //
const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

// --- Routes --- //
router.get("/dashboard", controller.dashboard);
// Add new goal
router.get('/new', controller.addGoal);
router.post('/new', controller.post_new_entry);
// Update goal
router.get('/decrement/:_id', controller.decrement); // Decrement
router.get('/increment/:_id', controller.increment); // Increment
// Delete goal
router.get('/delete/:_id', controller.deleteEntry); // Delete

router.post('/submit-form', controller.addTask)

// Edit Task
router.get('/editTask/:_id', controller.editTask);
router.post('/editTask/:_id', controller.editTaskPost);

// Complete task
router.get('/complete/:_id', controller.completeTask);
router.get('/retractCompleteTask/:_id', controller.retractCompleteTask);

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => { return res.status(404).send("Error 404 : Page Not Found"); });
// 500 - Any server error
router.use((req, res, next) => { return res.status(500).send("Error 500 : Internal Server Error") });

module.exports = router;