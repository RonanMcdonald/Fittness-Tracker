const modelDAO = require('../models/model');
const db = new modelDAO();

db.init();

exports.index = async (req, res) => {
    await db.getAllGoals().then(data => {
        res.render('dashboard', {
            'activeGoals': data.filter(goal => goal.isComplete === false),
            'completedGoals': data.filter(goal => goal.isComplete === true)
        })
        // console.log("data: ", data);
    })
}

exports.addGoal = async (req, res) => { 
    res.render('new_goal', {
        'title': "New Goal",
    })
}

exports.post_new_entry = function(req, res) {
    if (!req.body.name) {
        return response.status(400).send("Goal does not have a name");
    }

    const goalObject = {
        name: req.body.name,
        goal: req.body.amount,
        current: 0,
        isComplete: false
    }

    db.addGoal(goalObject);
    res.redirect(req.baseUrl + '/dashboard');
}

// ronan too smooth brain to do this
exports.update = function(req, res) {

    const goalObject = {
        _id: req.body.id,
        name: req.body.name,
        goal: req.body.amount,
        current: req.body.current,
        isComplete: req.body.isComplete
    }

    db.updateGoal(goalObject)
}

// Decrement
exports.decrement = async function(req, res) {
    const id = req.params._id;
    console.log(id);

    const goal = await db.getGoalById(id);
    await db.updateDecrement(goal._id, goal.current);
    res.redirect(req.baseUrl + '/dashboard');
}


// Increment
exports.increment = async function(req, res) {
    const id = req.params._id;
    console.log(id);

    const goal = await db.getGoalById(id);
    await db.updateIncrement(goal._id, goal.current);
    res.redirect(req.baseUrl + '/dashboard');
}