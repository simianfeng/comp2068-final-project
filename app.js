var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var schoolWorkRouter = require('./routes/schoolWork');
//passport and session
const passport = require('passport');
const session = require('express-session');
const config = require('./config/globals');
const githubStrategy = require('passport-github2').Strategy;
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configure session
app.use(session({
  secret: 's2021projectTracker',
  resave: false,
  saveUninitialized: false
}));

//initialize and set passport session
app.use(passport.initialize());
//make sure passport uses express-session to handle user session
app.use(passport.session());

//link passport to a user model
const User = require('./models/user');
passport.use(User.createStrategy());

//set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new githubStrategy(
  {
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  async (asscessToken, refreshToken, profile, done)=>{
    const user = await User.findOne({ oauthId: profile.id});
    if (user){
      return done(null, user);
    }
    else{
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      }
      );
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
));

app.use('/', indexRouter);
app.use('/schoolWork', schoolWorkRouter);

//after all the custom routers/controllers
//create connection string and modify password and database
const connectionString = 'mongodb+srv://admin:147258369simon@cluster0.buztc.mongodb.net/comp2068';
//call connect method of mongoose object, pass connection string and options
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
.then((message) => {
  console.log('connected successfully!');
})
.catch((err) => {
  console.log(err);
});

const hbs = require('hbs');
const { setFlagsFromString } = require('v8');
//HBS helper method to select values from dropdown lists
hbs.registerHelper('createOption', (currentValue, selectedValue)=>{
  var selectedAttribute = '';
  if (currentValue == selectedValue){
    selectedAttribute = 'selected'
  }
  return new hbs.SafeString("<option "+selectedAttribute + ">" + currentValue + "</option>");
});

hbs.registerHelper('toShortDate', (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
