// --- Initialization --- //
const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

// --- Routes --- //
// Generic:
// Root
router.get("/", controller.currentWeek);
// Dashboard
router.get("/:currentWeek", controller.dashboard);
// Delete entry
router.get('/delete/:_id', controller.deleteEntry);

// Goals:
// Add new goal
router.get('/new', controller.addGoal);
router.post('/new', controller.post_new_entry);
// Update goal
router.get('/decrement/:_id', controller.decrement); // Decrement
router.get('/increment/:_id', controller.increment); // Increment

// Tasks:
// Edit task
//router.get('/new_goal/:_id', controller.updateTask);
// Update Task
router.post('/submit-form', controller.addTask)

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => { return res.status(404).send("Error 404 : Page Not Found"); });
// 500 - Any server error
router.use((req, res, next) => { return res.status(500).send("Error 500 : Internal Server Error") });

module.exports = router;