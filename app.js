require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('*/css',express.static('public/css'));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (!err){
            const newUser = new User({
                email: req.body.email,
                password: hash
            });
            newUser.save()
            .then(() => {
                res.render("secrets");
            })
        } else {
            console.log(err);
        }
    });
    
})

app.post("/login", (req, res) => {

    User.findOne({email: req.body.email})
    .then((foundUser) => {
        if(!foundUser){
            console.log("Wrong email, try again.");
        } else{
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if (result) {
                    console.log("Success!");
                    res.render("secrets")
                } else {
                    console.log("Wrong Password");
                }
            });       
        }
    })
    .catch((err) => {
        console.log(err);
    })
})




app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});