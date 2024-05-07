const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
  
const app = express();
  
const port = process.env.PORT || 3001;
  
app.use(session({
    secret:'flashblog',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());
  
app.get('/', (req, res) => {
  req.flash('message', 'Welcome to Blog');
  res.redirect('/display-message');
});
  
app.get('/display-message', (req, res) => {
    res.send(req.flash('message'));
});
  
app.listen(port, (err) => {
  console.log('Server is up and listening on', port);
});