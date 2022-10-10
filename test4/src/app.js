var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3500 ;
require("./db/conn");
var FirstCollection = require("./models/schema");

require('dotenv').config();

var ejs = require("ejs");
var path = require("path");
var ejs_folder_path = path.join(__dirname,"../templates");
app.set("view engine","ejs");
app.set("views", ejs_folder_path );

var jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer');

var fs = require('fs');

let alert = require('alert');

var multer = require("multer");

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, "./images");
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // cb(null,Date.now() + '--' + file.originalname);
        cb(null,file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine });

const http = require('http').createServer(app)
app.use(express.static('public'))

app.get("/chat" ,async (req,res) =>{
  
   await res.render('chat') 

});  // specially check A to Z

app.get('/chats',(req,res)=>{
    // res.send("Hello world");
    res.sendFile(__dirname + '/index.html');
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
})

app.get("/" , (req,res)=>{
    res.send(process.env.SECRET_KEY);
});

app.get("/signup" , async (req,res)=>{
    res.render('home');
});

app.post("/signup" , async (req,res)=>{

    var token = jwt.sign({username:req.body.username},process.env.SECRET_KEY);
    var userverify = await jwt.verify(token,process.env.SECRET_KEY);

    res.cookie("token",token);

    deletinguser = await FirstCollection.find({complete:"no"}).deleteMany();

    try{

            if(req.body.password == req.body.confirmpassword){

                function between(min, max) {  
                    return Math.floor(
                      Math.random() * (max - min) + min
                    )
                  }
            
                  var otp = between(100000, 999999);

                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ghogharinikunj97@gmail.com',
                        pass: 'tjgjgbpgzsujdnsi'
                    }
                });
            
                var mailOptions = {
                    from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
                    to: `${req.body.Email}` ,                  // receiver's gmail
                    subject: 'one time otp',     //subject
                    text: `${otp}`                      //message Description
                };
            
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });

                var addingMensRecords = new FirstCollection(
                    {
                        username:req.body.username,
                        password:await bcrypt.hash(req.body.password,12),
                        confirmpassword:req.body.confirmpassword,
                        Email:req.body.Email,
                        otp:otp,
                        complete:"no",
                        multilogout:"no",
                        token:token
                    });

                await addingMensRecords.save();
                res.redirect('/otp'); 

            }else{
                alert("password and confirm password does not match");
                res.redirect('/signup'); 
            }

    }catch(e){
        alert("user already available");
        res.redirect('/signup');
    }

});

app.get("/otp" , async (req,res)=>{
    res.render('otp');
});

app.post("/otp" , async (req,res)=>{

    user = await FirstCollection.findOne({token:req.cookies.token});

    try{

        if(req.body.otp == user.otp){
            
            var updateuser = await FirstCollection.findOneAndUpdate({token:req.cookies.token},{$set:{complete:"yes"}});
            await updateuser.save();

            res.redirect('login');

        }

    else{
        await FirstCollection.findOne({complete:"no"}).deleteOne();
        alert("otp invalid");
        res.redirect('signup');
    }

}catch(e){

    }

});

app.get("/login" , (req,res)=>{
    res.render('login');
});

app.post("/login" , async (req,res)=>{

    deletinguser = await FirstCollection.find({complete:"no"}).deleteMany();

    try{

        var addingMensRecords = new FirstCollection(
            {
                username:req.body.loginusername,
                password:"password",
                confirmpassword:"confirmpassword",
                Email:"Email@gmail.com",
                complete:"no"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            });

        await addingMensRecords.save();

        await FirstCollection.findOne({password:"password"}).deleteOne();

        alert("username not find");

        res.redirect('/signup');

    }catch(e){

        var logindata = await FirstCollection.findOne({username:req.body.loginusername})

        res.cookie("multilogout",logindata.multilogout 
            , {
                httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

        var Passwordmatch = await bcrypt.compare(req.body.loginpassword,logindata.password);

        if(Passwordmatch){

            res.cookie("multilogout","no" 
            , {
                httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

            var tokeen = jwt.sign({username:req.body.loginusername},process.env.SECRET_KEY);
            var userverify = await jwt.verify(tokeen,process.env.SECRET_KEY);

                res.cookie("tokeen"
                ,tokeen 
            , {
                expires: new Date(Date.now()+300000) // here we are write milisecond
                ,httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            }
            );

            res.cookie("token",logindata.token 
            , {
                httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

            res.redirect('first');

        }

        else{

            alert("password does not match");
            res.redirect('login');

        }
    }

});

app.get("/first" , async (req,res)=>{

    try{

        var userverify = await jwt.verify(req.cookies.tokeen,process.env.SECRET_KEY);

        var logindata = await FirstCollection.findOne({username:req.body.loginusername})

        var multilogout = req.cookies.multilogout

        if(userverify || multilogout == "no"){
            
            res.render('first');
        }else{
            res.redirect('login');
        }

        res.cookie("multilogout",logindata.multilogout 
            , {
                httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

    }catch(e){
        res.redirect('login');
    }

});

app.post("/first" , async (req,res)=>{

})

app.get("/about" , async (req,res)=>{
    try{

        var userverify = await jwt.verify(req.cookies.tokeen,process.env.SECRET_KEY);

        if(userverify){
            res.render('about');
        }else{
            res.redirect('login');
        }

    }catch(e){
        res.redirect('login');
    }
});

app.get("/contact" , (req,res)=>{
    res.render('contact');
});

app.get("/terms" , (req,res)=>{
    res.render('terms');
});

app.get("/logout", async (req,res)=>{
    res.clearCookie("tokeen");
    res.redirect('login');
});

app.get("/forget" , async (req,res)=>{

    try{

        var forgettoken = jwt.sign({token:req.cookies.token},process.env.SECRET_KEY);

        res.cookie("forgettoken",forgettoken 
            , {
                expires: new Date(Date.now()+10000) // here we are write milisecond
                ,httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

            let update_data = await FirstCollection.findOneAndUpdate({token:req.cookies.token},{$set:{forgettimetoken:forgettoken}});

        var userverify = await jwt.verify(req.cookies.tokeen,process.env.SECRET_KEY);

        if(userverify){

            var forgetEmail = await FirstCollection.findOne({token:req.cookies.token});

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ghogharinikunj97@gmail.com',
                    pass: 'tjgjgbpgzsujdnsi'
                }
            });
        
            var mailOptions = {
                from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
                to: `${forgetEmail.Email}` ,                  // receiver's gmail
                subject: 'one time otp',     //subject
                text: `http://localhost:3500/forget/${forgettoken}`                      //message Description
            };
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {

                }

                res.end();

            });

        }

    }catch(e){
        res.redirect('login');
    }

});

app.get('/forget/:forgettimetoken',async (req,res)=>{

    try{
        
        var userverify = await jwt.verify(req.cookies.forgettoken,process.env.SECRET_KEY);
        
        if(userverify){
            res.render('forget');
        }else{
            res.redirect('/first')
        }

    }catch(e){
        res.redirect('/first')
    }

});

app.post('/forget/:refresh',async (req,res)=>{
    
    var update_data = await FirstCollection.findOneAndUpdate({token:req.cookies.token},{$set:{password:await bcrypt.hash(req.body.newpassword,12),
    confirmpassword:req.body.newpassword}});

    alert("password change");

});

app.get('/multi',async (req,res)=>{

    var update_data = await FirstCollection.findOneAndUpdate({token:req.cookies.token},{$set:{multilogout:"yes"}});

    res.cookie("multilogout","yes"  
            , {
                httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

    res.redirect('login');

});

// app.get('/multicheck',async (req,res)=>{

//     var multi = await FirstCollection.findOne({token:req.cookies.token});
//     var multilogout = multi.multilogout

//     res.cookie("multilogout",multilogout 
//             , {
//                 httpOnly:true // if we are write this lines so user does not removes or modifies cookies
//                 // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
//             });

//     res.redirect('login');

// });

http.listen(port , ()=>{
    console.log("Okay");
})  // it's required when we are use socket-io

// app.listen(port , ()=>{
//     console.log("Okay");
// })