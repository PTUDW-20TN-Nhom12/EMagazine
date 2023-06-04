import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Strategy as FacebookStrategy} from "passport-facebook";
import passport from "passport";

const GOOGLE_CLIENT_ID = '638129714576-tj4n4jo44t26j0q7043gd8k7n3046vnp.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const FACEBOOK_CLIENT_ID = '270314518708492';
const FACEBOOK_CLIENT_SECRET = 'ff0f01890f4aa8b6e17990cdf3741e3d';

const googleStrat = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
});

const facebookStrat = new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
})

export function setupOauth(router, callback) {
    // Passport setup
    router.use(passport.initialize());

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });
    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    passport.use(googleStrat);
    passport.use(facebookStrat);

    router.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', session: false }),
        function (req, res) {
            const name = req.user.displayName;
            const email = req.user.emails[0].value;
            const result = callback(name, email);
            if (result) {
                res.redirect("/");
            } else {
                // TODO: handle first time user ??
                res.redirect("/");
            }
        });
    
    router.get('/auth/facebook',
        passport.authenticate('facebook')); // , { scope: ['profile', 'email'] }
    // TODO: fix permission, since facebook restrict access to email !
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
        function (req, res) {
            const name = req.user.displayName;
            const email = req.user.emails[0].value; // will throw error on this
            const result = callback(name, email);
            if (result) {
                res.redirect("/");
            } else {
                // TODO: handle first time user ??
                res.redirect("/");
            }
        });
}