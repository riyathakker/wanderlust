const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Listing = require("./models/listing");
main().then((res)=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
//default root
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
//index route
app.get("/listings",async (req,res)=>{
  const alllisting= await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
})
//form route
app.get("/listing/new",  (req,res)=>{
	res.render("listings/new.ejs");
	})
//show route
app.get("/listing/:id", async (req,res)=>{
	let {id} = req.params;
	const listing = await Listing.findById(id);
	res.render("listings/show.ejs",{listing});
})
//add route
app.post("/listing", async (req,res)=>{
	
	const newlisting = new Listing(req.body);
	await newlisting.save();
	console.log("New listing saved");//printed as js obj with key value pairs
	res.redirect("/listings");
})
app.listen(8080,()=>{
    console.log("Listening on port 8080");
});