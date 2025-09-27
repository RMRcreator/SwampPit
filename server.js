const express = require('express')
const app = express()

const path = require('path');

//using this to make the profile pages dynamic
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// routing path
app.get('/', (req, res) => {
    res.send('Hello World!');
});


//this will take us to the profiles page
app.get('/profiles', (req, res) => {
    res.render('profiles', {topic: 'People profiles'});
    //res.send("It should have apunch of profiles on here");
});


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});