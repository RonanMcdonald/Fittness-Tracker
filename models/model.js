const Nedb = require('nedb');

// pList = Persistant list
// rList = Recurring list

class pList {
    constructor (dbFilePath) {
        if (dbFilePath) {
          // Embedded mode
          this.db = new Nedb({ filename: dbFilePath, autoload: true })
          console.log(`DB is connected to: ${dbFilePath}`)
        } else {
          // In-memory mode (restarts every time - useful during development)
          this.db = new Nedb()
          console.log('Successfully connected to DB in in-memory mode')
        }
    }

    init() {
        this.db.insert({
            name: 'Run',
            goal: 5,
            current: 2,
            isComplete: false
        });
        this.db.insert({
            name: 'Eat',
            goal: 4,
            current: 2,
            isComplete: false
        });
        this.db.insert({
            name: 'Swim',
            goal: 7,
            current: 6,
            isComplete: false
        });

        // Completed tasks
        this.db.insert({
            name: 'Tennis',
            goal: 5,
            current: 5,
            isComplete: true
        });
        this.db.insert({
            name: 'Walk',
            goal: 8,
            current: 9,
            isComplete: true
        });
        this.db.insert({
            name: 'Drink',
            goal: 7,
            current: 7,
            isComplete: true
        });

        // // Achievements
        // this.db.insert({
        //     name: 'Drink',
        //     goal: 7,
        //     current: 7,
        //     isComplete: true
        // });
    }

    addGoal(goal) {
        var entry = {
            name: goal.name,
            goal: goal.goal,
            current: 0,
            isComplete: false,
        }

        console.log('entry created', entry);
        this.db.insert(entry, function(err, doc) {
            if (err) {
             console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    updateGoal(goal) {
        this.db.update({ _id: goal.id }, {$set: goal}, {}, function () {

        })
    }

    getAllGoals() {
        return new Promise((resolve, reject) => {
            this.db.find({}).sort({ content: 1 }).exec((err, entries) => {
              err ? reject(err) : resolve(entries);
            })
        })
    }

    getActiveGoals() {
        return new Promise((resolve, reject) => {
            this.db.find({ isComplete: Boolean(false) }, (err, entries) => {
                err ? reject(err) : resolve(entries)
            })
        })
    }

    getCompletedGoals() {
        return new Promise((resolve, reject) => {
            this.db.find({ isComplete: true }, (err, entries) => {
                err ? reject(err) : resolve(entries), console.log("promise:", entries);
            })
        });

        console.log("COMPLETED GOALS REACHED");
    }

    updateDecrement(id, current) {
        this.db.update({ _id: id }, { $set: { current: (current - 1) }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    updateIncrement(id, current) {
        this.db.update({ _id: id }, { $set: { current: (current + 1) }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    getGoalById(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, entry) => {
                err ? reject(err) : resolve(entry)
            })
        })
    }
}

class rList {

}

module.exports = pList;