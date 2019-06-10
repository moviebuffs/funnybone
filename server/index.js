/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const userRoute = require('./routes/user-route');
const messageRoute = require('./routes/message-route');
const contentRoute = require('./routes/content-route');
const { loginRoute, passport, onlineUsers } = require('./routes/login-route');
const interestsRoute = require("./routes/interests-route");


const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);



// MIDDLEWARE

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(session({
  secret: 'your funny bone is not really on your elbow wink wink',
  resave: false,
  saveUninitialized: false,
}));

// AUTH MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.body);
    next();
  } else {
    res.redirect('/login');
  }
});

/**
 * This function checks to make sure user is aunthenticated
 * and isn't redirected to a login/signup page every refresh
 */
const verifySession = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('login:', req.body);
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/login', verifySession);

app.get('/logout', (req, res) => {
  const { user } = req;
  onlineUsers.forEach((onlineUser, index) => {
    if (onlineUser.id === user.id) {
      onlineUsers.splice(index, 1);
    } 
  });
  io.emit('online users', onlineUsers);
  req.logout();
  
  res.redirect('/');
});

loginRoute.post('/',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
  const { user } = req;
  const { online } = req.body;
  if (online === "on") {
    onlineUsers.push(user);
    
  }
  io.emit('online users', onlineUsers);
  res.redirect('/');
  });


app.use(express.static(path.join(__dirname, '../client/dist')));


// ROUTES
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);
app.use('/api/content', contentRoute);
app.use('/login', loginRoute);
app.use('/interests', interestsRoute);





io.on('connection', function(socket) {
  console.log('connected: server side')
  socket.emit('online users', onlineUsers);
})


const PORT = process.env.PORT || 8080;
// const socket = new WebSocket('ws://localhost:8080');
app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`
)});
// app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
http.listen(3000, function() {
  console.log(`websocket server listening on 3000`)
});


module.exports = { io };