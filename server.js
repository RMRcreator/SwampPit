const express = require('express')
const app = express()
const Profile = require('./Models/profileSchema.js')
const path = require('path');
//import mongoose model
const User = require('./models/User.js');
// for the password hashing
const bcrypt = require('bcryptjs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//using this to make the profile pages dynamic
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

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

// routing path to home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});


//this will take us to the profiles page
app.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find();   // fetch profiles from MongoDB
        res.render('profileList', { topic: 'People profiles', profiles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching profiles');
    }
});



app.get('/setup', (req, res) =>{
    res.render('ProfileCreation');
})

app.post('/set-profile', async (req, res) => {
    try {
        const newProfile = new Profile({
            name: req.body.name,
            age: req.body.age,
            year: req.body.year,
            major: req.body.major,
            classes: req.body.classes,
            interests: req.body.interests
        })

        await newProfile.save()
        res.redirect('/profiles') 
    } catch (err) {
        console.error(err)
        res.status(500).send('Error saving profile')
    }
})


// routing path to home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});


//this will take us to the profiles page
app.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find();   // fetch profiles from MongoDB
        res.render('profileList', { topic: 'People profiles', profiles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching profiles');
    }
});



app.get('/setup', (req, res) =>{
    res.render('ProfileCreation');
})

app.post('/set-profile', async (req, res) => {
    try {
        const newProfile = new Profile({
            name: req.body.name,
            age: req.body.age,
            year: req.body.year,
            major: req.body.major,
            classes: req.body.classes,
            interests: req.body.interests
        })

        await newProfile.save()
        res.redirect('/profiles') 
    } catch (err) {
        console.error(err)
        res.status(500).send('Error saving profile')
    }
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "html_files", "signup.html"))
})

app.post('/signup', async (req, res) => {
    console.log("Data recieved from form:", req.body);
    try {
        const {userEmail, userPass} = req.body;
        const hashedPass = await bcrypt.hash(userPass, 10);
        //save to database
        const newUser = new User({username: userEmail, passwordHash: hashedPass});
        await newUser.save();

        res.json({message: `Your account was created, ${req.body.userEmail}!`})
    }
    catch (err) {
        res.status(500).json({message: "Error creating user. Please try again. Email must be unique."});
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});