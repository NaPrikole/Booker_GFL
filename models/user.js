const bcrypt = require('bcrypt');
const mysql = require('mysql');
const dbConfig = require('../config/database').database;
let connection;

function handleDisconnect () {
    connection = mysql.createConnection(dbConfig);
    connection.connect(function(err) {              
        if(err) {
          setTimeout(handleDisconnect, 2000); 
        }
      });
      connection.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
          handleDisconnect();
        } else {
          throw err;
        }
      });
}

handleDisconnect();

module.exports.getAllUsers = function (callback) {
    connection.query("SELECT * FROM users", (err, result) => {
        callback(err, result);
    });
}

module.exports.getUserById = function (id, callback) {
    connection.query("SELECT * FROM users WHERE id = ?", id+'', (err, result) => {
        callback(err, result);
    });
}

module.exports.addUser = function (newUser, callback) {
    let username = newUser.username;
    let fullname = newUser.fullname;
    let email = newUser.email;
    let password = newUser.password;
    let admin = newUser.admin;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            connection.query("INSERT INTO `users` (username, fullname, email, password, admin) VALUES (?, ?, ?, ?, ?)", 
                [username, fullname, email, hash, admin],
                (err, result) => {
                    callback(err, result);
            });
        });
    });
}

module.exports.updateUser = function (updUser, id, callback) {
    let username = updUser.username;
    let fullname = updUser.fullname;
    let email = updUser.email;
    let password = updUser.password;
    let admin = updUser.admin;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        connection.query("UPDATE `users` SET ?, ?, ?, ?, ? WHERE id = ?", 
            [{username: username}, {fullname: fullname}, {email: email}, {password: hash}, {admin: admin}, id], 
            (err, result) => {
                callback(err, result);
        });
    });
}

module.exports.deleteUser = function (id, callback) {
    connection.query("DELETE FROM `users` WHERE id = ?", id.toString(), (err, result) => {
        callback(err, result);
    });
}

module.exports.getUserByUsername = function (username, callback) {
    connection.query("SELECT * FROM users WHERE username = ?", username.toString(), (err, result) => {
        callback(err, result);
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}