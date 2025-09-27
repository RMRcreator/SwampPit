const express = require('express')
const app = express()

const path = require('path');

//using this to make the profile pages dynamic
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// routing path to home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});


//this will take us to the profiles page
app.get('/profiles', (req, res) => {
    res.render('profileList', {topic: 'People profiles'});
    //res.send("It should have apunch of profiles on here");
});

//access the database with mongoose
const mongoose = require('mongoose');
async function connectDB() {
            try {
                const uri = "mongodb+srv://gator:gogators12345@swamppit.sawchly.mongodb.net/?retryWrites=true&w=majority&appName=SwampPit";
                await mongoose.connect(uri);
                console.log('Connected to MongoDB Atlas');
            } catch (err) {
                console.error('Error connecting to MongoDB Atlas:', err);
            }
        }
connectDB()

app.listen(3000, () => {
    console.log('Server started on port 3000');
});