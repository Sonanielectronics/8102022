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
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    Email:{
        type:String ,                                                                                         
        trim : true ,
        required : true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new error("Email is not valid");
            }
        }
    },
    token:{
        type:String
    },
    otp:{
        type:String
    },
    tokeen:{
        type:String
    },
    refresh:{
        type:String
    }
});

var FirstCollection = mongoose.model("collectionname",firstSchema);
module.exports = FirstCollection;