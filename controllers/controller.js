var Datastore = require('nedb')
var users = new Datastore({ filename: '/bin/users.db', autoload: true })
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var config = require('../config')
// User DAO

// Task DAO
const modelDAO = require('../models/model')
const db = new modelDAO()
db.init()

// Time object: enables getting of current time/dates
const moment = require('moment')
const { reset } = require('nodemon')
const e = require('express')
const { compareSync } = require('bcrypt')

// DASHBOARD //
exports.currentWeek = (req, res) => {
  const currentWeek = moment().isoWeek()
  res.redirect(`dashboard/${currentWeek}`)
}

exports.dashboard = async (req, res) => {
  const currentWeek = Number(req.params.currentWeek)
  const userID = req.cookies.cookie.userID
  await db.getAllGoals(currentWeek, userID).then((data) => {
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
      username: req.cookies.cookie.userName,
      tag: data.tag,
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
    userID: req.cookies.cookie.userID,
  }

  db.addPersistentGoal(goalObject)
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Decrement
exports.decrement = async function (req, res) {
  const id = req.params._id
  const goal = await db.getGoalById(id)
  if (goal.current < 2) {
    db.completeGoal(id, goal.goal)
  } else {
    await db.updateDecrement(goal._id, goal.current)
  }
  res.redirect(req.baseUrl + '/dashboard/' + req.params.currentWeek)
}

// Increment
exports.increment = async function (req, res) {
  const id = req.params._id
  const goal = await db.getGoalById(id)

  if (goal.current >= goal.goal - 1) {
    db.completeGoal(id, goal.goal)
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

  console.log('\n\n')
  console.log('THING THING THING')
  console.log(req.body.hiddenField)
  console.log('\n\n')

  const taskObject = {
    name: req.body.name,
    isComplete: false,
    isPersistent: false,
    weekNumber: Number(req.params.currentWeek),
    userID: req.cookies.cookie.userID,
    tag: req.body.hiddenField,
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

// ACCOUNT //
exports.signup = async function (req, res) {
  res.render('signup')
}

exports.login = async function (req, res) {
  if (typeof req.cookies.cookie == 'undefined') {
    res.cookie('cookie', { token: null, userID: null, userName: null })
  }

  if (req.cookies.cookie.token != null) {
    res.redirect('/dashboard')
  } else {
    res.render('login')
  }
}

exports.newUser = function (req, res) {
  console.log('\nNew User')

  var hashedPassword = bcrypt.hashSync(req.body.password, 8)
  users.insert(
    {
      username: req.body.username,
      password: hashedPassword,
    },
    function (err, user) {
      if (err) {
        return res.redirect('/signup')
      }
    }
  )
  res.redirect('/login')
}

exports.loginUser = function (req, res) {
  console.log('\nLogin User:')

  users.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return res.status(200).send('Server error encountered')
    }

    if (!user) {
      return res.status(404).send('User not found')
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        auth: false,
        token: null,
      })
    }

    jwt.sign({ user }, 'secretkey', (err, token) => {
      const userID = user._id
      const userName = user.username
      console.log(token)
      res.cookie('cookie', { token, userID, userName })
      res.redirect('/dashboard')
    })
  })
}

exports.logout = async function (req, res) {
  res.cookie('cookie', { token: null, userID: null, userName: null })
  res.redirect('/')
}

exports.authenticateToken = async function (req, res, next) {
  // console.log('\nAuth Token:')

  const authHeader = req.headers['authorization']
  const token = req.cookies.cookie.token // Previous code: authHeader && authHeader.split(' ')[1]

  // console.log('Token', req.cookies.cookie.token)
  // console.log('userID', req.cookies.cookie.userID)

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secretkey', () => {
    next()
  })
}

// ADMIN //
exports.getAllUsers = async function (req, res) {
  await users.find({}, (err, data) => {
    res.status(200).send({
      users: data,
    })
  })
}

exports.getAllUsersData = async function (req, res) {
  console.log('\nGet Data:')

  const userID = req.cookies.cookie.userID
  const userName = req.cookies.cookie.userName

  await db.getAllGoalsNew(userID).then((data) => {
    res.status(200).send({
      data,
    })
  })
}

// INDEX PAGE //
exports.renderIndex = async function (req, res) {
  if (typeof req.cookies.cookie == 'undefined') {
    res.cookie('cookie', { token: null, userID: null, userName: null })
  }

  res.render('index')
}

// ACCOUNT //
exports.account = async (req, res) => {
  res.render('account')
}
