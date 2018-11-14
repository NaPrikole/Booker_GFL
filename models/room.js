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

const Room = module.exports;

module.exports.getAllRooms = function (callback) {
    connection.query("SELECT * FROM rooms", (err, result) => {
        callback(err, result);
    });
}

module.exports.getRoomById = function (id, callback) {
    connection.query("SELECT * FROM rooms WHERE id = ?", id.toString(), (err, result) => {
        callback(err, result);
    });
}