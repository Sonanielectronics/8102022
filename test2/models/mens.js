var express = require("express");
const mongoose = require("mongoose");
var validator = require("validator");
// require("validator");
// const cors = require('cors');

var menSchema = new mongoose.Schema({
    FirstName:{
        type:String ,
        required : true
    },
    LastName:{
        type:String ,                                                                                         
        required : true
    },
    Email:{
        type:String,
        required : true ,
    },
    Username:{
        type:String,
        required : true ,
        unique : [true , "serial number already present"]
    },
    Password:{
        type:String,
        required : true ,
    }
    ,Password2:{
        type:String,
        required : true ,
    }

});

var MenRanking = new mongoose.model("MenRanking" , menSchema );

module.exports = MenRanking ;