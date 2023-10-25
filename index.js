const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());

app.use(
    session({
        secret:"Our little secret",
        resave:false,
        saveUninitialized:false
    })
);

// app.use(session({
//     cookie: { maxAge: 86400000 },
//     store: new MemoryStore({    
//         checkPeriod: 86400000 // prune expired entries every 24h
//     }),
//     resave: false,
//     secret: 'keyboard cat'
// }))


app.use(passport.initialize());
app.use(passport.session());

if(process.env.NODE_ENV === 'production'){
    // Express will serve up production assets
    // like our main.js file, or main.css file
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}


require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);