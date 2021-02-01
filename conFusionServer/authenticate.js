var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,{
        expiresIn:3600});
}

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({_id:jwt_payload._id}, (err, user) => {
        if(err){
            return done(err,false);
        }else if(user){
            return done(null, user);
        }else{
            return done(null,false);
        }
    });
}));


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },( function(accessToken, refreshToken, profile, done) {
        User.findOne({facebookId: profile.id} , (err, user) => {
            if(err){
                return done(err,null);
            }else if(!err && user !== null){
                return done(nul,user);
            }else{
                user = new User({username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.giveName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        })
    })
));



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser((User.deserializeUser()));


exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    }else{
        var err = new Error('you are not admin');
        next(err);
    }
}
