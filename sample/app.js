var express = require("express");
var app = express();
var alert = require('alert');

app.get("/", async (req,res)=>{

    alert("Hi");

})

app.get("/sample",(req,res)=>{
    res.send("Hi");
})

app.listen(3000)