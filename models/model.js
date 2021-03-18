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
        const names = [
            { // Goals : Active
                name: "Run",
                isComplete: false,
                isPersistent: true,
                goal: 25,
                current: 5,
                weekNumber: null
            },
            {
                name: "Drink",
                isComplete: false,
                isPersistent: true,
                goal: 33,
                current: 12,
                weekNumber: null
            },
            {
                name: "Swim",
                isComplete: false,
                isPersistent: true,
                goal: 12,
                current: 4,
                weekNumber: null
            },
            { // Goals : Completed
                name: "Dance",
                isComplete: true,
                isPersistent: true,
                goal: 44,
                current: 44,
                weekNumber: null
            },
            {
                name: "Eat",
                isComplete: true,
                isPersistent: true,
                goal: 29,
                current: 29,
                weekNumber: null
            },
            {
                name: "Wake early",
                isComplete: true,
                isPersistent: true,
                goal: 22,
                current: 22,
                weekNumber: null
            },
            { // Tasks : Active
                name: "Go swimming",
                isComplete: false,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 11
            },
            {
                name: "Do 20 push ups",
                isComplete: false,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 12
            },
            {
                name: "Go for a run",
                isComplete: false,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 13
            }, 
            { // Tasks : Complete
                name: "Eat healthy",
                isComplete: true,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 11
            },
            {
                name: "Dance",
                isComplete: true,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 12
            },
            {
                name: "Do 10 pull ups",
                isComplete: true,
                isPersistent: false,
                goal: 0,
                current: 0,
                weekNumber: 13
            }
        ];
        
        names.forEach(value => {
            this.db.insert({
                name: value.name, // task or goal name
                isComplete: value.isComplete, // is complete check 
                isPersistent: value.isPersistent, // true == goal | false == task
                goal: value.goal, // goal occurence aim
                current: value.current, // goal current progress
                weekNumber: value.weekNumber // which week created
            });
        })
    }

    // Generic
    getGoalById(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, entry) => {
                err ? reject(err) : resolve(entry)
            })
        })
    }

    deleteEntry(id) {
        this.db.remove({ _id: id }, { multi: false }, (err, numOfDocsRemoved) => {
            err ? console.log(`Error deleting goal: ${id}`) : console.log(`${numOfDocsRemoved} Goal removed from db`)
        })
    }
    
    // Specific
    addPersistentGoal(goal) {
        var entry = {
            name: goal.name,
            goal: goal.goal,
            current: goal.current,
            isComplete: goal.isComplete,
            isPersistent: goal.isPersistent
        }

        console.log('entry created', entry);
        this.db.insert(entry, function(err, doc) {
            err ? onsole.log('Error inserting document', subject) : console.log('document inserted into the database', doc);
        })
    }

    // Get all goals
    getAllGoals(weekNumber) {
        return new Promise((resolve, reject) => {
            console.log("Locating: Week", weekNumber)
            this.db.find({$or:[{weekNumber: weekNumber},{isPersistent: true}]}).sort({}).exec((err, entries) => {
              err ? reject(err) : resolve(entries);
            })
        })
    }

    // Decrement
    updateDecrement(id, current) {
        this.db.update({ _id: id }, { $set: { current: (current - 1) }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    // Increment
    updateIncrement(id, current) {
        this.db.update({ _id: id }, { $set: { current: (current + 1) }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    // --- TASKS ---- //
    addTask(task) {
        var entry = {
            name: task.name,
            isComplete: task.isComplete,
            isPersistent: task.isPersistent,
            weekNumber: task.weekNumber
        }

        console.log('entry created', entry);
        this.db.insert(entry, function(err, doc) {
            err ? onsole.log('Error inserting document', subject) : console.log('document inserted into the database', doc);
        })
    }

    editTask(id, name) {
        this.db.update({ _id: id }, { $set: { name: name }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    completeTask(id) {
        this.db.update({ _id: id }, { $set: { isComplete: true }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }

    retractCompleteTask(id) {
        this.db.update({ _id: id }, { $set: { isComplete: false }}, (err, numUpdated) => {
            err ? console.log(`Error updating goal: ${id}`) : console.log(`${numUpdated} Goal updated in db`)
        });
    }
}

module.exports = pList;