var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3500 ;
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
// console.log(ejs_folder_path);  // i was comment when i was file modify

// var expresslayouts = require('express-ejs-layouts');
// app.use(expresslayouts);
// app.set('layout','home.ejs'); // this 3 lines are not required 
app.set("view engine","ejs");
app.set("views", ejs_folder_path );

// console.log(process.env.SECRET_KEY); // i was comment when i was file modify
app.use(cookieParser());

var nodemailer = require('nodemailer');

var fs = require('fs');

let alert = require('alert'); 

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
        res.cookie("username",req.body.username);
        res.cookie("password",req.body.password);
        res.cookie("confirmpassword",req.body.confirmpassword);
        res.cookie("Email",req.body.Email);
        res.cookie("token",token);

        // var userverify = await jwt.verify(token,"thisissecretkeyandsecretkeyminimumsize32bitforbetter")
        // console.log(userverify);

            if(req.body.password == req.body.confirmpassword){

                function between(min, max) {  
                    return Math.floor(
                      Math.random() * (max - min) + min
                    )
                  }
            
                  var otp = between(100000, 999999);

                  res.cookie("otp",await bcrypt.hash(otp,12));
            
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ghogharinikunj97@gmail.com',
                        pass: 'tjgjgbpgzsujdnsi'
                    }
                });
            
                var mailOptions = {
                    from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
                    to: `${req.cookies.Email}` ,                  // receiver's gmail
                    subject: 'one time otp',     //subject
                    text: `${otp}`                      //message Description
                };
            
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });

                res.redirect('/otp');
            }else{
                alert("password does not matched");
                res.redirect('/signup'); 
            }

    }catch(e){
        alert("username already available");
        console.log(e);
    }

});

app.get("/otp" , (req,res)=>{
      
    res.render('otp');

});

app.post("/otp" , async (req,res)=>{

    var Passwordmatch = await bcrypt.compare(req.body.otp,req.cookies.password);
    console.log(passwordmatch);
    // var a = req.cookies.username

//     try{
//         if(req.body.otp == b){

//             var addingMensRecords = new FirstCollection(
//                 {
//                     username:req.cookies.username,
//                     password:req.cookies.password,
//                     confirmpassword:req.cookies.confirmpassword,
//                     email:req.cookies.email,
//                     token:req.cookies.token
//                     // token:jwt.sign({username:req.body.username},process.env.SECRET_KEY, { expiresIn: "24h" })
//                 });

//             await addingMensRecords.save();

//             res.redirect('login');
//         }

//     // }catch(e){
//     //     res.redirect('signup');
//     // }

//     else{
//         alert("otp invalid");
//         res.redirect('signup');
//     }
// }catch(e){
//         console.log(e);
//     }

res.end();
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
            var token = await jwt.sign({username:data.loginusername},"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
            res.cookie("jwt",token 
            , {
                expires: new Date(Date.now()+1000) // here we are write milisecond
                ,httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

            // res.send(req.cookies.jwt);
            // var tokeeen = jwt.sign({username:data.loginusername},process.env.SECRET_KEY);
            res.redirect('first');
        }
        
        createeTokeen();

        // res.cokkie("jwt",tokeeen);
    }
    else {
        alert("wrong password or username");
    }

    // res.cokkie("jwt",tokeeen);

    }catch(e){
    }

});

app.get("/first" , async (req,res)=>{
    try{
        var userloginverify = await jwt.verify(req.cookies.jwt,"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        if(userloginverify){
            res.render('first',myFunction)
        }
    }catch(e){
        res.render('login');
    }
});

app.post("/first" , async (req,res)=>{
// res.render('first');
});

app.get("/first", async (req,res)=>{
    try{
        var userloginverify = await jwt.verify(req.cookies.jwt,"thisissecretkeyandsecretkeyminimumsize32bitforbetter");
        if(userloginverify){
            res.render('first',myFunction)
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

app.get("/forget" , async (req,res)=>{

    // console.log(req.cookies.username);

    var forgetuser = await FirstCollection.findOne({username:req.cookies.username})
    // console.log(forgetuser);

    var forgettoken = jwt.sign({username:forgetuser.username},"thisissecretkeyandsecretkeyminimumsize32bitforbetter");

    let update_data = await FirstCollection.findOneAndUpdate({username:req.cookies.username},{$set:{refresh:forgettoken}});
        update_data.save();

    res.cookie("forgettoken",forgettoken);

    // console.log(forgetuser.Email);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ghogharinikunj97@gmail.com',
            pass: 'tjgjgbpgzsujdnsi'
        }
    });  

    var mailOptions = {
        from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
        to: forgetuser.Email ,                  // receiver's gmail
        subject: 'one time otp',     //subject
        text: `http://localhost:3500/forget/${forgettoken}`                      //message Description
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log('Email sent: ' + info.response);
        }
    });

    var b = fs.readFileSync(`${ejs_folder_path}/forget.ejs`) ;
    var c = b.toString();

    fs.writeFileSync(`${ejs_folder_path}/${forgettoken}.ejs`,`${c}`);

    res.end();
    // res.redirect(`/${n}`);
});

    // function makeCounter() {
      
    //     return function() {
    //         var m = fs.readFileSync(`read.txt`) ;
    //         n = m.toString();
    //       return n;
    //     };
    //   }
      
    //   let counter = makeCounter();  // function variable in outside function

      app.get('/forget/:refresh',async (req,res)=>{
        // let update_data = await FirstCollection.findOneAndUpdate({refresh:req.cookies.username},{$set:{refresh:forgettoken}});
        // update_data.save();
        var data = req.body;
        console.log(data);
    })

// app.get( `/${n}`, async (req,res)=>{
// });

// // as a middele ware we are use function(it's means external function) // important point i was wate my 2 days in this topic
// // use function as a routes if possible i think 99.99% not possible but i was not find this one but i am some little headline try and asking to anuj and i was get negative answer

app.listen(port , ()=>{
    console.log("Okay");
})