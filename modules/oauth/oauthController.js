const oauthService = require("./oauthService");
// const query = require("../service").query;
const { query, errorLog } = require("../service");

class OauthController {
    passport = require("passport");
    passsport_name = {
        google: "google-oauth20",
        facebook: "facebook",
        linkedin: "linkedin-oauth2",
    };
    config = {
        google: {
            clientID: process.env.GoogleID,
            clientSecret: process.env.GoogleSecret,
            callbackURL: process.env.GoogleCallbackURL,
            profileFields: ["id", "displayName", "name", "gender", "profileUrl", "emails", "picture.type(large)"],
            scope: { scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"] },
        },
        facebook: {
            clientID: process.env.FacebookID,
            clientSecret: process.env.FacebookSecret,
            callbackURL: process.env.FacebookCallbackURL,
            profileFields: ["id", "displayName", "name", "gender", "profileUrl", "emails", "picture.type(large)"],
            scope: { scope: ["email"] },
        },
        linkedin: {
            clientID: process.env.LinkedinID,
            clientSecret: process.env.LinkedinSecret,
            callbackURL: process.env.LinkedinCallbackURL,
            // profileFields: ["id", "displayName", "name", "gender", "profileUrl", "emails", "picture.type(large)"],
            // scope: { scope: ['r_emailaddress', 'r_liteprofile'] },
            // scope: '',
            // state: true
        }
    };

    initialize(app) {
        const session = require("express-session");
        app.use(
            session({
                secret: "keyboard cat",
                resave: false,
                saveUninitialized: false,
            })
        );
        this.passport.serializeUser(function (user, done) {
            done(null, user);
        });
        this.passport.deserializeUser(function (obj, done) {
            done(null, obj);
        });
        app.use(this.passport.initialize());
        app.use(this.passport.session());
        app.get("/exit", oauthService.logOut);
    }

    create(strategy_type) {
        const Strategy = require(`passport-${this.passsport_name[strategy_type]}`).Strategy;
        this.passport.use(
            new Strategy(this.config[strategy_type], async (accessToken, refreshToken, profile, done) => {
                process.nextTick(async () => {
                    const sql = `SELECT * FROM users WHERE userid = '${profile.id}'`;
                    await query(sql)
                        .then(async (result) => {
                            if (result && result.length === 0) {
                                await oauthService.addUser(profile, done);
                            } else if (result[0].userid === profile.id) {
                                await oauthService.isUser(profile, done);
                            }
                        })
                        .catch((error) => {
                            done(error, null);
                        });
                });
            })
        );
    }

    autorisation(app, strategy_type) {
        this.create(strategy_type);
        app.get(`/${strategy_type}`, this.passport.authenticate(`${strategy_type}`, this.config[strategy_type].scope));
        app.get(`/${strategy_type}callback`, (req, res, next) => {
            this.passport.authenticate(`${strategy_type}`, { failureRedirect: "/person", failureMessage: true }, async (error, user, info) => {
                if (error === null) {
                    await oauthService.updateToken(req, res, user.id);
                } else {
                    errorLog(error, 'error', 'Autorisation error: Error creating user record');
                    res.redirect("/home");
                }
            })(req, res, next);
        });
    }
}

module.exports = new OauthController();
