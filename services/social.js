const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;

const { clientID, clientSecret } = require("../util/keys");

passport.use(
  new GoogleTokenStrategy(
    { clientID, clientSecret },
    (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
module.exports = passport;
