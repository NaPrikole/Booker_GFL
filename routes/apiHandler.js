const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');
const Room = require('../models/room');
const EventHandler = require('../models/event');

// Get All Users
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.getAllUsers((err, users) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get all Users. Check db connection' });
        } else {
            res.json(users);
        }
    });
});

// Get Single User By ID
router.get('/users/:id', (req, res, next) => {
    User.getUserById(req.params.id, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get User' });
        }
        res.json(user);
    });
});

// Register New User
router.post('/users/register', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let newUser = req.body;
    //Verify
    if (!newUser) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        User.addUser(newUser, (err, user) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to register new User' });
            } else {
                res.json({ success: true, msg: 'User registered' });
            }
        });
    }
});

// Update User
router.put('/users/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let updUser = req.body;
    let id = req.params.id;
    //Verify
    if (!updUser) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        User.updateUser(updUser, id, (err, user) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to update User' });
            } else {
                res.json({ success: true, msg: 'User updated' });
            }
        });
    }
});

// Delete User
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let id = req.params.id;
    User.deleteUser(id, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete User' });
        } else {
            res.json({ success: true, msg: 'User deleted' });
        }
    });
});

// Authenticate User
router.post('/users/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        user = user[0];
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                return res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    user: {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
                        admin: user.admin
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

// User`s Profile
router.get('/users/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// Get All Rooms
router.get('/rooms', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Room.getAllRooms((err, rooms) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get all Rooms' });
        } else {
            res.json(rooms);
        }
    });
});

// Get Single Room By ID
router.get('/rooms/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let id = req.params.id;
    Room.getRoomById(id, (err, room) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get Room' });
        } else {
            res.json(room);
        }
    });
});

// Get All Events
router.get('/events', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(req.query.room) {
        EventHandler.getAllEventsByRoom(req.query.room, (err, events) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to get all Events by Room' });
            } else {
                res.json(events);
            }
        });
    } else if(req.query.room && req.query.month) {
        EventHandler.getAllEventsByRoomByMonth(req.query.room, req.query.month, (err, events) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to get all Events by Room by Month' });
            } else {
                res.json(events);
            }
        });
    } else if (req.query.idrecCounter) {
        EventHandler.getIdrecLastCounter((err, idrecCounter) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to get last idrec' });
            } else {
                res.json(idrecCounter);
            }
        });
    } else if (req.query.idrec) {
        EventHandler.getAllEventsByIdrec(req.query.idrec, (err, events) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to get all Events by Idrec' });
            } else {
                res.json(events);
            }
        });
    } else {
        EventHandler.getAllEvents((err, events) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to get all Events' });
            } else {
                res.json(events);
            }
        });
    }
});

// Get Single Event By ID
router.get('/events/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    EventHandler.getEventById(req.params.id, (err, event) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get Event' });
        }
        res.json(event);
    });
});

// Add New Event
router.post('/events', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let newEvent = req.body;
    //Verify
    if (!newEvent) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        EventHandler.addEvent(newEvent, (err, event) => {
            if (err) {
                console.log(err)
                res.json({ success: false, msg: 'Failed to add new Event' });
            } else {
                res.json({ success: true, msg: 'Event registered' });
            }
        });
    }
});

// Update Event
router.put('/events/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let updEvent = req.body;
    let id = req.params.id;
    //Verify
    if (!updEvent) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        EventHandler.updateEvent(updEvent, id, (err, event) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to update Event' });
            } else {
                res.json({ success: true, msg: 'Event updated' });
            }
        });
    }
});

// Delete Event
router.delete('/events/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let id = req.params.id;
    EventHandler.deleteEvent(id, (err, event) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete Event' });
        } else {
            res.json({ success: true, msg: 'Event deleted' });
        }
    });
});

module.exports = router;