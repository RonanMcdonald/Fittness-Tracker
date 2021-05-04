// --- Initialization --- //
const express = require('express')
const controller = require('../controllers/controller')
const router = express.Router()

// --- Routes --- //
// Splash //
router.get('/', controller.renderIndex)

// Registration & Login //
router.get('/signup', controller.signup)
router.get('/login', controller.login)
router.get('/logout', controller.logout)

router.post('/signup', controller.newUser)
router.post('/login', controller.loginUser)

// Account //
router.get('/account', controller.authenticateToken, controller.account)

// Dashboard //
router.get('/dashboard', controller.authenticateToken, controller.currentWeek)
router.get('/dashboard/:currentWeek', controller.authenticateToken, controller.dashboard)
// Add new goal
router.get('/new/:currentWeek', controller.authenticateToken, controller.addGoal)
router.post('/new/:currentWeek', controller.authenticateToken, controller.post_new_entry)
// Update goal
router.get('/decrement/:_id/:currentWeek', controller.decrement) // Decrement
router.get('/increment/:_id/:currentWeek', controller.increment) // Increment
// Delete goal
router.get('/delete/:_id/:currentWeek', controller.authenticateToken, controller.deleteEntry) // Delete
// Add task
router.post('/submit-form/:currentWeek', controller.authenticateToken, controller.addTask)
// Edit Task
router.get('/editTask/:_id/:currentWeek', controller.authenticateToken, controller.editTask)
router.post('/editTask/:_id/:currentWeek', controller.authenticateToken, controller.editTaskPost)
// Complete task
router.get('/complete/:_id/:currentWeek', controller.authenticateToken, controller.completeTask)
router.get('/retractCompleteTask/:_id/:currentWeek', controller.authenticateToken, controller.retractCompleteTask)
// Switch week
router.get('/nextWeek/:currentWeek', controller.authenticateToken, controller.nextWeek) // Next week
router.get('/prevWeek/:currentWeek', controller.authenticateToken, controller.prevWeek) // Prev week
router.get('/currWeek', controller.authenticateToken, controller.currentWeek) // Current week

// ADMIN //
router.get('/users', controller.getAllUsers)
router.get('/users_data', controller.authenticateToken, controller.getAllUsersData)

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => {
  return res.status(404).send('Error 404 : Page Not Found')
})
// 500 - Any server error
router.use((req, res, next) => {
  return res.status(500).send('Error 500 : Internal Server Error')
})

module.exports = router
