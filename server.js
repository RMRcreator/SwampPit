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
    res.render('profileList', {topic: 'People profiles'});
    //res.send("It should have apunch of profiles on here");
});


//access the database and print the database names
const {MongoClient} = require('mongodb');
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - $SwampPit`));
};
async function main(){
    const uri = "mongodb+srv://gator:gogators12345@swamppit.sawchly.mongodb.net/?retryWrites=true&w=majority&appName=SwampPit"
    const client = new MongoClient(uri); 

    try {
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});