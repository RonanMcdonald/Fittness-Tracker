const modelDAO = require('../models/model');
const db = new modelDAO();

db.init();

exports.index = async (req, res) => {
    await db.getAllGoals().then(data => {
        res.render('index', {
            'activeGoals': data.filter(goal => goal.isComplete === false),
            'completedGoals': data.filter(goal => goal.isComplete === true)
        })
        console.log("data: ", data);
    })

    // await db.getActiveGoals().then(data => {
    //     res.render('index', {
    //         'activeGoals': data
    //         // 'completedGoals': data
    //     })
    //     console.log("data: ", data);
    // })
}
