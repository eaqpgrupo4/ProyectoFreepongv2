var mongoose = require('mongoose');
var User = mongoose.model('Usuario');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var configAuth = require('./auth');
// var TwitterStrategy = require('passport-twitter').Strategy;


module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookStrategy(
        {
            clientID: configAuth.facebookAuth.id,
            clientSecret: configAuth.facebookAuth.secret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields : configAuth.facebookAuth.profileFields
        },
        myFacebookStrategy));

        

    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL

        },
        myTwitterStrategy));

       

    function myFacebookStrategy(accessToken, refreshToken, profile, done){
            console.log(profile);

            User.findOne({provider_id: profile.id}, 
                function(err, user){
                    if(err) throw(err);
                    if(!err && user!= null) return done(null, user);
                    var user = new User(
                        {
                            nombre: profile.name.givenName,
                            apellidos: profile.name.familyName,
                            login: profile.name.givenName,
                            urlfoto: profile.photos[0].value,
                            // email:profile.emails[0].value,
                            provider_id:profile.id
                        });
                    console.log(user);

                    user.save(function(err)
                    {
                        if(err) throw err;
                        done(null, user);
                    });
            });


        };

        function myTwitterStrategy(token, refreshToken, profile, done) {
            console.log(profile);

            User.findOne({provider_id: profile.id}, 
                function(err, user){
                    if(err) throw(err);
                    if(!err && user!= null) return done(null, user);
                    var user = new User(
                        {   

                            nombre: profile.displayName,
                            
                            login: profile.username,
                            urlfoto: profile.photos[0].value,
                            // email:profile.emails[0].value,
                            provider_id:profile.id
                        });
                    console.log(user);

                    user.save(function(err)
                    {
                        if(err) throw err;
                        done(null, user);
                    });
            });


        };
};




