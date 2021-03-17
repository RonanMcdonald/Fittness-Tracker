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
            goal: 12,
            current: 7,
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
            goal: 12,
            current: 12,
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
}

class rList {

}

module.exports = pList;