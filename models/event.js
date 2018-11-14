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
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
          handleDisconnect();
        } else {
          throw err;
        }
      });
}

handleDisconnect();

module.exports.getAllEvents = function (callback) {
    connection.query("SELECT * FROM events", (err, result) => {
        callback(err, result);
    });
}

module.exports.getAllEventsByIdrec = function (idrec, callback) {
    connection.query("SELECT * FROM events WHERE idrec = ?", idrec, (err, result) => {
        callback(err, result);
    });
}

module.exports.getAllEventsByRoom = function (room, callback) {
    connection.query("SELECT * FROM events WHERE idroom = ?", room, (err, result) => {
        callback(err, result);
    });
}

module.exports.getAllEventsByRoomByMonth = function (room, month, callback) {
    connection.query("SELECT * FROM events WHERE idroom = ? AND month = ?", [room, month], (err, result) => {
        callback(err, result);
    });
}

module.exports.getEventsByRoomByDay = function (room, day, callback) {
    connection.query("SELECT * FROM events WHERE idroom = ? AND day = ?", [room, day], (err, result) => {
        callback(err, result);
    });
}

module.exports.getEventById = function (id, callback) {
    connection.query("SELECT * FROM events WHERE id = ?", id.toString(), (err, result) => {
        callback(err, result);
    });
}

module.exports.getIdrecLastCounter = function (callback) {
    connection.query("SELECT MAX(idrec) AS lastIdrecCounter FROM events", (err, result) => {
        callback(err, result);
    });
}

module.exports.addEvent = function (newEvent, callback) {
    let idrec = newEvent.idrec;
    let description = newEvent.description;
    let iduser = newEvent.iduser;
    let idroom = newEvent.idroom;
    let starttime = newEvent.starttime;
    let endtime = newEvent.endtime;
    let created = newEvent.created;
    connection.query("INSERT INTO `events` (idrec, description, iduser, idroom, starttime, endtime, created) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [idrec, description, iduser, idroom, starttime, endtime, created],
        (err, result) => {
            callback(err, result);
    });
}

module.exports.updateEvent = function (updEvent, id, callback) {
    let idrec = updEvent.idrec;
    let description = updEvent.description;
    let iduser = updEvent.iduser;
    let idroom = updEvent.idroom;
    let starttime = updEvent.starttime;
    let endtime = updEvent.endtime;
    let created = updEvent.created;
    connection.query("UPDATE `events` SET ?, ?, ?, ?, ?, ?, ? WHERE id = ?", 
        [{idrec: idrec}, {description: description}, {iduser: iduser}, {idroom: idroom}, {starttime: starttime},
            {endtime: endtime}, {created: created}, id], 
            (err, result) => {
                callback(err, result);
    });
}

module.exports.deleteEvent = function (id, callback) {
    connection.query("DELETE FROM `events` WHERE id = ?", id.toString(), (err, result) => {
        callback(err, result);
    });
}