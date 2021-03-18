const modelDAO = require('../models/model');
const db = new modelDAO();

const moment = require('moment');

db.init();

exports.currentWeek = (req, res) => {
    const currentWeek = moment().isoWeek()
    res.redirect(`${currentWeek}`)
}

exports.dashboard = async (req, res) => {
    await db.getAllGoals().then(data => {
        res.render('dashboard', {
            'activePersistentGoals': data.filter(goal => goal.isComplete === false && goal.isPersistent === true),
            'completedPersistentGoals': data.filter(goal => goal.isComplete === true),
            'activeRecurring': data.filter(goal => goal.isComplete === false && goal.isPersistent === false)
        })
        // console.log("data: ", data);
    })
}

// Delete goal
exports.deleteEntry = async function(req, res) {
    const id = req.params._id;
    await db.deleteEntry(id);
    res.redirect(req.baseUrl + '/dashboard');
}


exports.addGoal = async (req, res) => { 
    res.render('new_goal');
}

exports.post_new_entry = function(req, res) {
    if (!req.body.name) {
        return response.status(400).send("Goal does not have a name");
    }

    const goalObject = {
        name: req.body.name,
        goal: req.body.amount,
        current: 0,
        isComplete: false,
        isPersistent: true
    }

    db.addPersistentGoal(goalObject);
    res.redirect(req.baseUrl + '/dashboard');
}

// Decrement
exports.decrement = async function(req, res) {
    const id = req.params._id;
    const goal = await db.getGoalById(id);
    await db.updateDecrement(goal._id, goal.current);
    res.redirect(req.baseUrl + '/dashboard');
}

// Increment
exports.increment = async function(req, res) {
    const id = req.params._id;
    const goal = await db.getGoalById(id);
    await db.updateIncrement(goal._id, goal.current);
    res.redirect(req.baseUrl + '/dashboard');
}

// Add Task
exports.addTask = async function(req, res) {
    if (!req.body.name) {
        return response.status(400).send("Goal does not have a name");
    }

    const taskObject = {
        name: req.body.name,
        isComplete: false,
        isPersistent: false,
        weekNumber: 0
    }

    db.addTask(taskObject);
    res.redirect(req.baseUrl + '/dashboard');
}

exports.editTask = async (req, res) => { 
    res.render('edit_task');
}

exports.editTaskPost = async function (req, res) { 
    console.log("EDIT PAGE REACHED")
    // const id = req.params._id;
    // const goal = await db.getGoalById(id);
    // await db.updateIncrement(goal._id, goal.current);
    res.redirect(req.baseUrl + '/dashboard');
}