const express = require('express')
const app = express()
const Profile = require('./Models/profileSchema.js')
const path = require('path');
//import mongoose model
const User = require('./models/User.js');
// for the password hashing
const bcrypt = require('bcryptjs');
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "signing key for cookies",
    resave: false,
    saveUnitialized: false
}))


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

//authentication setup
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/login');
    }
}

// testing!!!!!!!
const fs = require('fs');

// Serve /assets/* (where your logo file lives)
const ASSETS_DIR = path.resolve(__dirname, 'assets');
app.use('/assets', express.static(ASSETS_DIR));

// User data file
const USERS_FILE = path.resolve(__dirname, 'users.json');

// Helpers for loading/saving users
// function loadUsers() {
// try {
// const raw = fs.readFileSync(USERS_FILE, 'utf-8');
// return JSON.parse(raw);
// } catch {
// return [];
// }
// }
// function saveUsers(users) {
// fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
// }

// Simple helper: find a file named "logo" with a common image extension
function getLogoUrl() {
try {
const files = fs.readdirSync(ASSETS_DIR);
const preferred = files.find(f => /^logo\.(svg|png|jpe?g|webp|gif)$/i.test(f));
const anyImg = files.find(f => /\.(svg|png|jpe?g|webp|gif)$/i.test(f));
const chosen = preferred || anyImg || null;
return chosen ? `/assets/${chosen}` : null;
} catch {
return null;
}
}



// // GET /login page
// app.get('/login', (req, res) => {
// res.type('html').send(`
// <!doctype html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <meta name="viewport" content="width=device-width,initial-scale=1"/>
// <title>Log in — SwampPit</title>
// <style>
// body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial;margin:0;background:#ffffff;color:#111827}
// .wrap{max-width:420px;margin:0 auto;padding:24px}
// h1{font-size:28px;margin:24px 0}
// form{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:20px}
// label{display:block;font-size:14px;margin:12px 0 6px}
// input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px}
// .btn{width:100%;margin-top:16px;padding:12px;border:0;border-radius:12px;background:#7c3aed;color:#fff}
// .btn:hover{filter:brightness(0.95)}
// a{color:#7c3aed;text-decoration:none}
// </style>
// </head>
// <body>
// <div class="wrap">
// <a href="/">← Back</a>
// <h1>Log in</h1>
// <form method="POST" action="/login">
// <label>Email</label>
// <input type="email" name="email" required placeholder="you@example.com"/>
// <label>Password</label>
// <input type="password" name="password" required placeholder="••••••••"/>
// <button class="btn">Log in</button>
// </form>
// <p style="margin-top:16px;font-size:14px;">Don’t have an account? <a href="/signup">Sign up</a></p>
// </div>
// </body>
// </html>
// `);
// });

// // POST /login — checks credentials
// app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
// const { email, password } = req.body;
// const users = loadUsers();

// const user = users.find(u => u.email === email && u.password === password);
// if (!user) {
// return res.send(`
// <p style="color:red;">Invalid credentials.</p>
// <a href="/login">← Back to Log in</a>
// `);
// }

// res.send(`
// <h1>Welcome back, ${user.name}!</h1>
// <p>You are now logged in.</p>
// <a href="/">← Home</a>
// `);
// });

// // GET /signup page
// app.get('/signup', (req, res) => {
// res.type('html').send(`
// <!doctype html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <meta name="viewport" content="width=device-width,initial-scale=1"/>
// <title>Sign up — SwampPit</title>
// <style>
// body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial;margin:0;background:#ffffff;color:#111827}
// .wrap{max-width:420px;margin:0 auto;padding:24px}
// h1{font-size:28px;margin:24px 0}
// form{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:20px}
// label{display:block;font-size:14px;margin:12px 0 6px}
// input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px}
// .btn{width:100%;margin-top:16px;padding:12px;border:0;border-radius:12px;background:#7c3aed;color:#fff}
// .btn:hover{filter:brightness(0.95)}
// a{color:#7c3aed;text-decoration:none}
// </style>
// </head>
// <body>
// <div class="wrap">
// <a href="/">← Back</a>
// <h1>Sign up</h1>
// <form method="POST" action="/signup">
// <label>Name</label>
// <input type="text" name="name" required placeholder="Your full name"/>
// <label>Email</label>
// <input type="email" name="email" required placeholder="you@example.com"/>
// <label>Password</label>
// <input type="password" name="password" required placeholder="Choose a password"/>
// <button class="btn">Sign up</button>
// </form>
// <p style="margin-top:16px;font-size:14px;">Already have an account? <a href="/login">Log in</a></p>
// </div>
// </body>
// </html>
// `);
// });

// // POST /signup — creates a new user
// app.post('/signup', express.urlencoded({ extended: true }), (req, res) => {
// const { name, email, password } = req.body;
// const users = loadUsers();

// const exists = users.find(u => u.email === email);
// if (exists) {
// return res.send(`
// <p style="color:red;">Email already exists.</p>
// <a href="/signup">← Back to Sign up</a>
// `);
// }

// users.push({ name, email, password });
// saveUsers(users);

// res.send(`
// <p>Welcome, ${name}! Your account has been created.</p>
// <a href="/login">→ Continue to Log in</a>
// `);
// });

// // Start the server
// app.listen(3000, () => {
// console.log('SwampPit running on http://localhost:3000');
// });
// // testing!!!!!


// Home page
app.get('/', (req, res) => {
const logo = getLogoUrl();

res.type('html').send(`
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SwampPit</title>
<style>
:root { --purple:#7c3aed; }
body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial;margin:0;background:#faf5ff;
background:linear-gradient(#efe9ff, #ffffff); color:#111827}
.wrap{max-width:960px;margin:0 auto;padding:24px}
.top{display:flex;justify-content:flex-end;gap:12px}
.btn{display:inline-block;padding:10px 16px;border:1px solid var(--purple);border-radius:12px;
color:var(--purple);text-decoration:none}
.btn:hover{background:#f3e8ff}
.hero{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px 64px}
.logo{width:min(90vw, 560px);height:auto;display:block}
.hint{margin-top:16px;color:#6b7280;font-size:14px}
.warn{color:#b91c1c;font-size:14px;margin-top:16px}
</style>
</head>
<body>
<div class="wrap">
<div class="top">
<a class="btn" href="/login">Log in</a>
<a class="btn" href="/signup">Sign up</a>
</div>

<section class="hero">
${
logo
? `<img class="logo" src="${logo}" alt="SwampPit logo">`
: `<div class="warn">
No logo found in <code>/assets</code>.<br>
Put your file as <code>assets/logo.svg</code> (or .png/.jpg/.webp/.gif) and refresh.
</div>`
}
<div class="hint">Find friends who match your vibe.</div>
</section>
</div>
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
            Interests: interests,
            Username: req.session.username,
        })
       
        // if they have a profile, update existing one. else make a new profile
        const currentUser = await User.findOne({ username : req.session.username });
        if (currentUser.hasProfile){
            await Profile.updateOne({ Username: req.session.username }, {$set: {
                Name: name,
                Age: age,
                Year: year,
                Major: major,
                Classes: classes,
                Interests: interests,
                Username: req.session.username,
                }
            });
        } else{
            await newProfile.save();
            await User.updateOne({ username: req.session.username }, { $set: {hasProfile: true}});
        }
        res.json({success: true, message: `Your profile was saved!`})
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

        req.session.isAuth = true;
        req.session.username = newUser.username;
        res.json({success: true, message: `Your account was created, ${req.body.userEmail}!`})
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
            req.session.isAuth = true;
            req.session.username = user.username;
            res.json({ sessUser: user.username, success: true, message: "Login successful"});
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