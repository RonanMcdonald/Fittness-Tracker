const modelDAO = require('../models/model')
const db = new modelDAO()

// Time object: enables getting of current time/dates
const moment = require('moment')
const { reset } = require('nodemon')
const e = require('express')

db.init()

exports.currentWeek = (req, res) => {
  const currentWeek = moment().isoWeek()
  res.redirect(`dashboard/${currentWeek}`)
}

exports.dashboard = async (req, res) => {
  const today = new moment()
  const currentWeek = Number(req.params.currentWeek)
  await db.getAllGoals(currentWeek).then((data) => {
    res.render('dashboard', {
      activePersistentGoals: data.filter((goal) => goal.isComplete === false && goal.isPersistent === true),
      completedPersistentGoals: data.filter((goal) => goal.isComplete === true && goal.isPersistent === true),
      activeRecurring: data.filter((goal) => goal.isComplete === false && goal.isPersistent === false),
      completedRecurring: data.filter((goal) => goal.isComplete === true && goal.isPersistent === false),
      weekRange: {
        startDate: moment().week(currentWeek).day(0).format('MMMM Do'),
        endDate: moment().week(currentWeek).day(7).format('MMMM Do'),
      },
      currentWeek: currentWeek,
      nextWeek: currentWeek + 1,
      previousWeek: currentWeek - 1,
    })
  })
}

// Delete goal
exports.deleteEntry = async function (req, res) {
  const id = req.params._id
  await db.deleteEntry(id)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Add goal
exports.addGoal = async (req, res) => {
  res.render('new_goal')
}

exports.post_new_entry = function (req, res) {
  if (!req.body.name) {
    console.log('ERROR 400')
    return res.redirect(req.baseUrl + '/')
  }

  const goalObject = {
    name: req.body.name,
    goal: req.body.amount,
    current: 0,
    isComplete: false,
    isPersistent: true,
  }

  db.addPersistentGoal(goalObject)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Decrement
exports.decrement = async function (req, res) {
  const id = req.params._id
  const goal = await db.getGoalById(id)
  await db.updateDecrement(goal._id, goal.current)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Increment
exports.increment = async function (req, res) {
  const id = req.params._id
  const goal = await db.getGoalById(id)

  // NOT WORKING, NEED TO UPDATE: WAS SUPPOSED TO BE BOUNDRY HANDLING
  if (goal.current + 1 == goal.goal) {
    await db.updateIncrement(goal._id, goal.current)
  } else {
    await db.updateIncrement(goal._id, goal.current)
  }
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Add Task
exports.addTask = async function (req, res) {
  if (!req.body.name) {
    console.log('ERROR 400')
    return res.redirect(req.baseUrl + '/')
  }

  const taskObject = {
    name: req.body.name,
    isComplete: false,
    isPersistent: false,
    weekNumber: Number(req.params.currentWeek),
  }

  db.addTask(taskObject)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

exports.editTask = async (req, res) => {
  res.render('edit_task')
}

exports.editTaskPost = async function (req, res) {
  const id = req.params._id
  const task = await db.getGoalById(id)

  const name = req.body.name

  db.editTask(task._id, name)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

exports.completeTask = async function (req, res) {
  const id = req.params._id
  const task = await db.getGoalById(id)

  db.completeTask(task._id)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

exports.retractCompleteTask = async function (req, res) {
  const id = req.params._id
  const task = await db.getGoalById(id)

  db.retractCompleteTask(task._id)
  console.log('Controller: retractCompleteTask')
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

exports.nextWeek = async function (req, res) {
  const currentWeek = Number(req.params.currentWeek)
  const newWeek = currentWeek + 1

  res.redirect(req.baseUrl + '/dashboard/' + newWeek)
}

exports.prevWeek = async function (req, res) {
  const currentWeek = Number(req.params.currentWeek)
  const newWeek = currentWeek - 1

  res.redirect(req.baseUrl + '/dashboard/' + newWeek)
}

exports.renderIndex = async function (req, res) {
  res.render('index')
}

exports.signup = async function (req, res) {
  res.render('signup')
}

exports.login = async function (req, res) {
  res.render('login')
}
