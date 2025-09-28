const express = require('express')
const app = express()
const Profile = require('./Models/profileSchema.js')
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//using this to make the profile pages dynamic
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

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
        res.redirect('/profiles') // <-- add this line
    } catch (err) {
        console.error(err)
        res.status(500).send('Error saving profile')
    }
})


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