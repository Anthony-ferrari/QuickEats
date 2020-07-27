const express = require("express");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const request = require("request");


app.use(session({ localVar: null, secret: "marley" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set view engine
app.set("view engine", "ejs");
//linking main.css
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done)=>{
    console.log('access token', accessToken);
    console.log('refresh token', refreshToken);
    console.log('profile', profile);
  })
);
// get handler for google OAUTH
app.get('/auth/google', passport.authenticate('google',{
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback', passport.authenticate('google'));
// QuickEats origin page GET Route
app.get("/", (req, res) => {
  res.render("recipes/intro");
});

// Home Page GET Route
app.get("/Home", (req, res)=>{
  res.render("recipes/index");
});

// About Page GET Route
app.get("/About", (req, res)=>{
  res.render("recipes/about");
});

// Form Page GET Route
app.get("/Form", (req, res)=>{
  res.render("recipes/form");
});

// Results Page GET Route
app.get("/Results", (req, res)=>{
  if (req.session.localVar == null) {
    res.render("404");
  } else {
    var postContext = req.session.localVar;
    res.render("recipes/results", postContext);
  }
});

// Results Page POST Route
app.post("/Results", (req, res) => {
  req.session.ingredientList = [req.body];

  request("http://www.recipepuppy.com/api/?i=" + req.body.ingredient, function (
    err,
    response,
    body
  ) {
    if (!err && 200 <= response.statusCode < 400) {
      // the body is the response.data.results
      const recipes = JSON.parse(body);
      // adding recipes to daParams
      const daParams = [];
      for (var p in recipes.results) {
        daParams.push(recipes.results[p]);
      }
      // adding key-value pair of postBodyRequest: daParams
      const postContext = {};
      postContext.postBodyRequest = daParams;
      // making localVar: postContext
      req.session.localVar = postContext;
      res.redirect("/Results");
    } else {
      console.log(err);
    }
  });
});

//error handling from lecture
app.use( (req, res)=>{
  res.status(404);
  res.render("404");
});

app.use( (err, req, res, next)=>{
  console.error(err.stack);
  res.type("plain/text");
  res.status(500);
  res.render("500");
});
// set port number P
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Express started on http://${process.env.HOSTNAME}:${app.get(
      "port"
    )}; press Ctrl-C to terminate.`
  );
});
