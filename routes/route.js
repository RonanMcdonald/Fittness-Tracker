// --- Initialization --- //
const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

// --- Routes --- //
router.get('/', controller.currentWeek)

router.get('/dashboard/:currentWeek', controller.dashboard);
// Add new goal
router.get('/new/:currentWeek', controller.addGoal);
router.post('/new/:currentWeek', controller.post_new_entry);
// Update goal
router.get('/decrement/:_id/:currentWeek', controller.decrement); // Decrement
router.get('/increment/:_id/:currentWeek', controller.increment); // Increment
// Delete goal
router.get('/delete/:_id/:currentWeek', controller.deleteEntry); // Delete
// Add task
router.post('/submit-form/:currentWeek', controller.addTask)
// Edit Task
router.get('/editTask/:_id/:currentWeek', controller.editTask);
router.post('/editTask/:_id/:currentWeek', controller.editTaskPost);

// Complete task
router.get('/complete/:_id', controller.completeTask);
router.get('/retractCompleteTask/:_id', controller.retractCompleteTask);

// Next week
router.get('/nextWeek/:currentWeek', controller.nextWeek);
router.get('/prevWeek/:currentWeek', controller.prevWeek);

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => { return res.status(404).send('Error 404 : Page Not Found'); });
// 500 - Any server error
router.use((req, res, next) => { return res.status(500).send('Error 500 : Internal Server Error') });

module.exports = router;