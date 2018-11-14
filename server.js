const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const apiHandler = require('./routes/apiHandler');

const app = express();

// CORS Middlewear
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'dist')));

// Set views engine
app.engine('html', require('ejs').renderFile);

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport Middlewear
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Use Routes
app.use('/api', apiHandler);

// Use redirect for all client requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(process.env.PORT || 9001, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
