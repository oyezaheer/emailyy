const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);


const app = express();
app.use(
    session({
        secret:"Our little secret",
        resave:false,
        saveUninitialized:false
    })
);

// app.use(cookieSession( {
//     maxAge:30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey]
// })
// );

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}),
function(req,res){
     console.log("success");
     res.redirect("http://localhost:3000/");
}
);
    
app.get(
    '/auth/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

// require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);