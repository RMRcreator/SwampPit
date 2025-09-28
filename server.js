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
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>SwampPit</title>
      </head>
      <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding:24px;">
        <header style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <img src="/logo1/logo.svg" alt="SwampPit logo 1" style="height:56px;width:auto;border-radius:8px;">
          <img src="/logo2/logo.svg" alt="SwampPit logo 2" style="height:56px;width:auto;border-radius:8px;">
          <strong style="font-size:28px;">SwampPit</strong>
        </header>
        <p style="margin-top:12px;color:#444;">Find friends who match your vibe.</p>
      </body>
    </html>
  `);
});


// this will take us to the profiles page
app.get('/profiles', async (req, res) => {
    try {
        const searchQuery = req.query.q; // text from ?q=...
        let filter = {};

        if (searchQuery) {
            // Look for matches in Name, Major, or Year (case-insensitive)
            filter = {
                $or: [
                    { Name: new RegExp(searchQuery, 'i') },
                    { Major: new RegExp(searchQuery, 'i') },
                    { Year: new RegExp(searchQuery, 'i') },
                ]
            };
        }

        const profiles = await Profile.find(filter);   // fetch profiles with filter
        res.render('profileList', { topic: 'People profiles', profiles, q: searchQuery});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching profiles');
    }
});




app.get('/set-profile', (req, res) =>{
    res.render('ProfileCreation');
})

app.post('/set-profile', async (req, res) => {
    try {
        const {name, age, year, major, classes, interests} = req.body;
        const newProfile = new Profile({
            Name: name,
            Age: age,
            Year: year,
            Major: major,
            Classes: classes,
            Interests: interests
        })

        await newProfile.save()
        res.redirect('/profiles') 
    } catch (err) {
        console.error(err)
        res.status(500).send('Error saving profile')
    }
})

// sign up
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


//log in
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "html_files", "login.html"))
})

app.post('/login', async (req, res) => {
    console.log("Data recieved from form:", req.body);
    try {
        const { userEmail, userPass } = req.body;
        const user = await User.findOne({ username: userEmail });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const storedHash = user.passwordHash;
        const match = await bcrypt.compare(userPass, storedHash);

        
        if (match) {
            res.json({ success: true, message: "Login successful"});
        }
        else {
            res.json({message: "Error logging in, check your email and password."});
        }
    }
    catch (err) {
        res.status(500).json({message: "Error logging in."});
    }
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
