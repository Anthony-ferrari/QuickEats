const passport = require('passport');

module.exports = (app)=>{

    // get handler for google OAUTH
    app.get('/auth/google', passport.authenticate('google',{
        scope: ['profile', 'email']
    })
    );

    app.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/recipes'}));
    app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

    app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};

// missing the return get handlers
