var mongoose = require("mongoose");
var express = require("express");
var validator = require("validator")

var firstSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique : [true , "username already present"]
    },
    password:{
        type:String,
        required:true,
        unique : [true , "password already present"]
    },
    confirmpassword:{
        type:String,
        required:true,
        unique : [true , "password already present"]
    },
    // Email:{
    //     type:String ,                                                                                         
    //     trim : true ,
    //     required : true,
    //     validate(value){
    //         if (!validator.isEmail(value)){
    //             throw new error("Email is not valid");
    //         }
    //     }
    // },
    token:{
        type:String
    },
    tokeen:{
        type:String
    }
});

var FirstCollection = mongoose.model("collectionname",firstSchema);
module.exports = FirstCollection;