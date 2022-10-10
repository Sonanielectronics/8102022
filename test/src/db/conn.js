var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test3")
.then( ()=>{
    console.log("conn okay");
})
.catch( (e)=>{
    console.log(e);
})