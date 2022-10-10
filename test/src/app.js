var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 4500 ;
require("./db/conn");
var FirstCollection = require("./models/schema"); // schema files require then compulsory store in variable and variable name is collection name
var ejs = require("ejs");
var path = require("path");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// require('dotenv').config();
require('dotenv').config();
var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended:false}));  // if not run then and then only exchange this lines into another 3 lines

var ejs_folder_path = path.join(__dirname,"../templates");
console.log(ejs_folder_path);
// var expresslayouts = require('express-ejs-layouts');
// app.use(expresslayouts);
// app.set('layout','home.ejs'); // this 3 lines are not required 
app.set("view engine","ejs");
app.set("views", ejs_folder_path );

console.log(process.env.SECRET_KEY);
app.use(cookieParser());

var nodemailer = require('nodemailer');

app.get("/" , (req,res)=>{
    res.send("Hi");
});

app.get("/signup" , (req,res)=>{
    res.render('home');
});

app.post("/signup" , async (req,res)=>{
    try{

        // var createToken = async() => {
        //     // jwt.sign({_id:12451},"secretkey")
            // var token = jwt.sign({username:req.body.username},"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        //     console.log(token);
        // }
        
        // createToken();

        var token = jwt.sign({username:req.body.username},"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        res.cookie("jwt2",token);
        // res.cookie("username",req.body.username);
        // res.cookie("password",await bcrypt.hash(req.body.password,12));
        // res.cookie("confirmpassword",req.body.confirmpassword);

        var userverify = await jwt.verify(token,"thisissecretkeyandsecretkeyminimumsize32bitforbetter")
        console.log(userverify);

        var addingMensRecords = new FirstCollection(
            {
                username:req.body.username,
                password:await bcrypt.hash(req.body.password,12),
                confirmpassword:req.body.confirmpassword,
                token:jwt.sign({username:req.body.username},"thisissecretkeyandsecretkeyminimumsize32bitforbetter" , { expiresIn: "24h" })
                // token:jwt.sign({username:req.body.username},process.env.SECRET_KEY, { expiresIn: "24h" })
            });

            if(req.body.password == req.body.confirmpassword){
                await addingMensRecords.save();
                // res.redirect('login');  // i think not sure please try it whener i was implemented otp based account open when i was change in this code so no idea 
            }

            // if(req.body.password == req.body.confirmpassword){

            //     await addingMensRecords.save();  // here we are added data into database and their we are delete if required

            //     var transporter = nodemailer.createTransport({
            //         service: 'gmail',
            //         auth: {
            //             user: 'ghogharinikunj97@gmail.com',
            //             pass: 'tjgjgbpgzsujdnsi'
            //         }
            //     });
        
            //     function between(min, max) {  
            //         return Math.floor(
            //           Math.random() * (max - min) + min
            //         )
            //       }
            //       var otp = between(100000, 999999);
            //       res.cookie("otp",otp);
        
            //     var mailOptions = {
            //         from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
            //         to: req.body.Email ,                  // receiver's gmail
            //         subject: 'one time otp',     //subject
            //         text: `${otp}`                      //message Description
            //     };
        
            //     transporter.sendMail(mailOptions, function (error, info) {
            //         if (error) {
            //             console.log(error);
            //         } else {
            //             console.log('Email sent: ' + info.response);
            //         }
            // //     });

            //     res.redirect('/otp');
            // }
            else{
                res.redirect('/signup'); 
            }

    }catch(e){
        console.log(e);
    }

});

app.get("/otp" , (req,res)=>{
    res.render('otp');
});

app.post("/otp" , async (req,res)=>{

    try{
        if(req.body.otp == req.cookies.otp){

            // var addingMensRecords = new FirstCollection(
            //     {
            //         username:req.cookies.username,
            //         password:req.cookies.password,
            //         confirmpassword:req.cookies.confirmpassword,
            //         token:req.cookies.token
            //         // token:jwt.sign({username:req.body.username},process.env.SECRET_KEY, { expiresIn: "24h" })
            //     });

            // await addingMensRecords.save();

            res.redirect('login');
        }

    // }catch(e){
    //     res.redirect('signup');
    // }

    else{
        var a = await FirstCollection.findOne({username:req.cookies.username}).deleteOne();
        res.redirect('signup');
    }
}catch(e){
        console.log(e);
    }

});

app.get("/login" , (req,res)=>{
    res.render('login');
});

app.post("/login" , async (req,res)=>{

    try{

        var data = req.body;
    // console.log(data);
    // console.log(data.loginpassword);
    let user = await FirstCollection.find({username:data.loginusername});
    // console.log(user);

    // console.log(user[0].password);  // hash
    // console.log(data.loginpassword);
    var Passwordmatch = await bcrypt.compare(data.loginpassword,user[0].password);
    // console.log(Passwordmatch);

    var userverify = await jwt.verify(user[0].token,"thisissecretkeyandsecretkeyminimumsize32bitforbetter")
    // var userverify = await jwt.verify(user[0].token,process.env.SECRET_KEY)
    // console.log(userverify);

    if(Passwordmatch){

        var createeTokeen = async() => {
            var tokeen = await jwt.sign({username:data.loginusername},"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
            res.cookie("jwt",tokeen 
            , {
                expires: new Date(Date.now()+150000) // here we are write milisecond
                ,httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });
            // res.send(req.cookies.jwt);
            // var tokeeen = jwt.sign({username:data.loginusername},process.env.SECRET_KEY);
            res.redirect('first');
        }
        
        createeTokeen();

        // res.cokkie("jwt",tokeeen);

        console.log("password matched");
    }
    else {
        console.log("wrong password or username");
    }

    // res.cokkie("jwt",tokeeen);

    }catch(e){
        // console.log(e);
    }

});

app.get("/first", async (req,res)=>{
    try{
        var userloginverify = await jwt.verify(req.cookies.jwt,"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        if(userloginverify){
            res.render('first')
        }
    }catch(e){
        res.render('login');
    }
});

app.get("/logout", async (req,res)=>{
    try{
        var tokan = req.cookies.jwt ;
        // console.log(tokan);
        var verifyloginuser = jwt.verify(tokan,"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        // console.log(verifyloginuser)
        verifyloginusers = await FirstCollection.findOne({username:verifyloginuser.username});
        // console.log(verifyloginusers)

        // for delete 2nd method //
        // req.tokan = tokan;
        // req.verifyloginusers = verifyloginusers ;

        // req.verifyloginusers.tokans = req.verifyloginusers.tokans.filter((currentElement)=>{\
        //     return currentElement.tokan == req.tokan
        // })

        // completed method //

        res.clearCookie("jwt");
        // await req.verifyloginusers.save();  add this lines if cookie is not delete but here i was delete cookie without this lines first time better result as compair to thapa
        
    }catch(e){
        res.status(500).send(e);
    }
    res.redirect('login');
});

app.get("/about" , (req,res)=>{
    res.render('about');
});

app.get("/contact" , (req,res)=>{
    res.render('contact');
});

app.get("/terms" , (req,res)=>{
    res.render('terms');
});

app.get("/multi" , async (req,res)=>{
    var tokan = req.cookies.jwt ;
    var verifyloginuser = jwt.verify(tokan,"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
    verifyloginusers = await FirstCollection.findOne({username:verifyloginuser.username}).deleteOne();
    res.clearCookie("jwt2");
    res.redirect('signup');
});

app.post('/abcd' , async(req,res)=>{
    res.send(req.body)
})

app.listen(port , ()=>{
    console.log("Okay");
})
