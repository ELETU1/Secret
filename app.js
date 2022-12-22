//jshint esversion:6
require('dotenv').config()
const exp = require('express')
const bp = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = exp()
app.use(bp.urlencoded({extended: true}))
app.use(exp.static("public"))

app.set("view engine", "ejs")

mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/userDB")

//user schema and model
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

//generate key
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = new mongoose.model("User", userSchema)


app.get("/", function(req, res){
  res.render("home")
})

// Login
app.route("/login")
.get(function(req, res){
  res.render("login")
})
.post(function(req, res){
  const username = req.body.username
  const pass = req.body.password

  User.findOne({email: username}, function(err, result){
    if(!err){
      if(result){
        if(result.password === pass){
          res.render("secrets")
        }
      }
    }
  })
})

//Register
app.route("/register")
.get(function(req, res){
  res.render("register")
})

.post(function(req, res){
  const user1 = new User({
    email: req.body.username,
    password:  req.body.password
  })

  user1.save(function(err){
    if(!err){
      res.render("secrets")
    }
  })

})

app.listen(3000, function(){
  console.log("Server Listening begins")
})
