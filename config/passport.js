const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const config = require('../config/database');
const User = require('../models/user');

module.exports = function (passport) {
    let container = {};
    container.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    container.secretOrKey = config.secret;
    passport.use(new JwtStrategy(container, (jwt_payload, done) => {
        User.getUserById(jwt_payload.id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}