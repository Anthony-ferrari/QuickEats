var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

app.use(session({localVar: null, secret: 'marley' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set view engine
app.set("view engine", "ejs");
//linking main.css
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// QuickEats origin page GET Route
app.get("/", function(req, res){
    res.render("recipes/intro");
});

// Home Page GET Route
app.get("/Home", function(req, res){
    res.render("recipes/index")
});

// About Page GET Route
app.get("/About", function(req, res){
    res.render("recipes/about");
});

// Form Page GET Route
app.get("/Form", function(req, res){
    res.render("recipes/form");
});

// Results Page GET Route
app.get("/Results", function(req,res){
  if(req.session.localVar == null){
    res.render("404")
  }else{
    var postContext = req.session.localVar
    res.render("recipes/results", postContext);
  }
});

// Results Page POST Route
app.post("/Results", (req, res)=>{
  req.session.ingredientList = [req.body]

  request("http://www.recipepuppy.com/api/?i=" + req.body.ingredient, function(err, response, body){
    if(!err && 200<=response.statusCode < 400){
      // the body is the response.data.results
      var recipes = JSON.parse(body);
      // adding recipes to daParams
      var daParams = []
      for (var p in recipes.results){
        daParams.push(recipes.results[p]);
      }
      // adding key-value pair of postBodyRequest: daParams
      var postContext = {}
      postContext.postBodyRequest = daParams;
      // making localVar: postContext
      req.session.localVar = postContext
      res.redirect("/Results")
    }else{
      console.log(err);
    }
  });
});

//error handling from lecture
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
// set port number
app.set('port', 7111)

app.listen(app.get('port'), function(){
    console.log(
      `Express started on http://${process.env.HOSTNAME}:${app.get(
        'port'
        )}; press Ctrl-C to terminate.`
        );
  });