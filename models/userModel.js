const Datastore = require('nedb')
const bcrypt = require('bcrypt')
const saltRounds = 10

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      //embedded
      this.db = new Datastore({ filename: dbFilePath, autoload: true })
    } else {
      //in memory
      this.db = new Datastore()
    }
  }

  create(username, password) {
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var entry = {
        user: username,
        password: hash,
      }
      this.db.insert(entry, function (err) {
        if (err) {
          console.log("Can't insert user: ", username)
        }
      })
    })
  }

  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(null, null)
      } else {
        if (entries.length == 0) {
          return cb(null, null)
        }
        return cb(null, entries[0])
      }
    })
  }
}

const userDao = new UserDAO('users.db')
module.exports = userDao
