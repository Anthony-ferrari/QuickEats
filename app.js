const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require('cookie-session');
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const request = require("request");
const app = express();
const keys = require('./config/keys');

require('./models/User');
require('./routes/authRoutes')(app);
require('./services/passport');

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true});

app.use(session({ localVar: null, secret: "marley" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set view engine
app.set("view engine", "ejs");
//linking main.css
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// cookie is storing data into session
// session will have ID 
// this is different than express-session where the cookie references a session:
// a session id is given as an index to a session store (hash map) and then we can access the user id (node inside linked list)
// cookie-session allows for 14 KB and express-session uses a remote server 
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
// passport is pulling id out of req.session's data
app.use(passport.initialize());
app.use(passport.session());

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
