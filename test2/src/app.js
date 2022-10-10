var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
require("../db/conn");
// const cors= require('cors');
var MenRanking = require("../models/mens");
var bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
var bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');

app.get("/home", async (req, res) => {
    res.send("this is home page");
});

app.use(express.json());
// app.use(cors({
//     origin:" http://localhost:3000"
// }))

app.get("/Registers", async (req, res) => {

    var securePassword2 = async(Password2)=>{
        var PasswordHash = await bcrypt.hash(Password2,12);
        console.log(PasswordHash);

        var Passwordmatch = await bcrypt.compare(Password2,PasswordHash);  // first is login password it's means user password & second is database password
        console.log(Passwordmatch);
    }

    securePassword2("Ghoghari");

    try {
        var addingMensRecords = new MenRanking(
            {
                "FirstName": "Nik",
                "LastName": "Ghoghari",
                "Email": "Surat",
                "Username": "Nikx",
                "Password": "12345",
                "Password2":"12345"
            })

        addingMensRecords.save();
        res.end();

    } catch (e) {
        res.status(400).send(e);
    }
});  // menually data transefer

app.get("/Register" , (req,res)=>{
    res.send("Hi")
})

app.post("/mens", async (req, res) => {

    var addingMensRecords = new MenRanking(req.body);
    console.log(addingMensRecords);

    try {
        var insertMens = await addingMensRecords.save();
        res.status(201).send(insertMens)
        // console.log(insertMens.Password2);
        // res.send(insertMens);

    //     var securePassword2 = async(Password2)=>{
    //     var PasswordHash = await bcrypt.hash(Password2,12);
    //     console.log(PasswordHash);

    //     var Passwordmatch = await bcrypt.compare(Password2,PasswordHash);  // first is login password it's means user password & second is database password
    //     console.log(Passwordmatch);
    // }

    // securePassword2(insertMens.Password2);

    } catch (e) {
        res.status(400).send(e);
    }
});  // using post man data transefer

// app.get("/Signin", async (req, res) => {

//     try {
//         var studentsData = await MenRanking.find();
//         res.send(studentsData);
//     } catch (err) {
//         res.send(err);
//     }
// });

app.delete("/delete/:_id", async (req, res) => {

    try {
        let _id = req.params._id;
        console.log(_id);
        let data = await MenRanking.findByIdAndDelete({ _id: _id });
        var studentsData = await MenRanking.find();
        res.send("deleted")
    } catch (err) {
        res.send(err);
    }
});

app.patch('/update/:_id', async (req, res) => {
    let _id = req.params._id;
    // console.log(_id);
    let data = await MenRanking.findById(_id);
    // console.log(data);
    // res.render('edit',{data});

    let update_data = await MenRanking.findByIdAndUpdate({_id},{$set:{FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Username:req.body.Username,
        Password:req.body.Password,
        // Password2:req.body.Password2,
        Password2:await bcrypt.hash(req.body.Password2,12)
    }
        // req.body.save
    });
    update_data.save();
    res.send(update_data);
})

app.get('/get/:_id', async (req, res) => {
    let _id = req.params._id;
    let data = await MenRanking.findById(_id);
    res.send(data);
})

app.post('/start',async(req,res)=>{

try {

    const user = await MenRanking.findOne({Username:req.body.Username});

    if(!user) return res.send('user does not exiosts...')
    if(user){
    var Passwordmatch = await bcrypt.compare(req.body.Password2,user.Password2)
    // if(user.Password !== req.body.Password) return res.send('username or password invalid..');
    if(Passwordmatch == false) return res.send('username or password invalid..');
    res.send("login");}
    
    // res.status(200).json({user});
} catch (error) {
    // res.status(500).json(error);
    res.send(error);
}

})

app.listen(port, () => {
    console.log("okay");
});

//Login
