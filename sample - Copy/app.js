var express = require("express");
var app = express();
var popup = require('popups');

app.get("/", async (req,res)=>{

    alert("Hi");

})

app.get("/sample",(req,res)=>{
    console.log(" sample app ");
})

app.listen(3000)