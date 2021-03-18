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
            isComplete: false,
            isPersistent: true,
        });
        this.db.insert({
            name: 'Eat',
            goal: 4,
            current: 2,
            isComplete: false,
            isPersistent: true,
        });

        this.db.insert({
            name: 'Tennis',
            goal: 5,
            current: 5,
            isComplete: true,
            isPersistent: true,
        });
        this.db.insert({
            name: 'Walk',
            goal: 8,
            current: 9,
            isComplete: true,
            isPersistent: true,
        });

        // Recurring
        this.db.insert({
            name: 'Run',
            isComplete: false,
            isPersistent: false,
            weekNumber: 0
        });
        this.db.insert({
            name: 'Eat',
            isComplete: false,
            isPersistent: false,
            weekNumber: 0
        });

        // this.db.insert({
        //     name: 'Swim',
        //     goal: 7,
        //     current: 6,
        //     isComplete: false
        // });
        // this.db.insert({
        //     name: 'Drink',
        //     goal: 7,
        //     current: 7,
        //     isComplete: true
        // }); 
        
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
    getAllGoals() {
        return new Promise((resolve, reject) => {
            this.db.find({}).sort({ content: 1 }).exec((err, entries) => {
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

    editTask(task) {
        console.log("edit");
    }
}

module.exports = pList;