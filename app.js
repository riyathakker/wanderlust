const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
main().then((res)=>{
    console.log("Done");
})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.get("/",(req,res)=>{
    res.send("Hi, i am root route");
});
app.get("/testlisting",async(req,res)=>{
let sample = new Listing({
    title: "My villa",
    description : "This is my new villa", 
    price: 19000,
    location: "Mandvi",
    country: "India",
});
await sample.save();
console.log("Saved");
res.send("Success");
});
app.listen(8080,()=>{
    console.log("Listening");
});