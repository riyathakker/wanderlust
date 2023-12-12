const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsmate = require("ejs-mate");
const Listing = require("./models/listing");
const methodoverride = require("method-override");

//connect to db
main().then((res)=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
//connect to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
//default root
app.get("/",(req,res)=>{
    res.send("Hi, i am root route");
});
//test route
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
	console.log(listing);
	res.render("listings/show.ejs",{listing});
})
//add route
app.post("/listing", async (req,res)=>{
	
	const newlisting = new Listing(req.body.listing);
	await newlisting.save();
	console.log("New listing saved");//printed as js obj with key value pairs
	res.redirect("/listings");
})
//edit route
app.get("/listing/:id/edit", async (req,res)=>{
	let {id} = req.params;
	const listing = await Listing.findById(id);
	res.render("listings/edit.ejs",{listing});
})
//update route
app.put("/listing/:id", async (req,res)=>{
	let {id} = req.params;
	await Listing.findByIdAndUpdate(id,{...req.body.listing});
	console.log("Updated listing saved");//printed as js obj with key value pairs
	res.redirect(`/listing/${id}`);
})
//delete route
app.delete("/listing/:id", async(req,res)=>{
	let {id} = req.params; 
	await Listing.findByIdAndDelete(id);
	console.log("Deleted succesfully");
	res.redirect("/listings");
})
//listen route
app.listen(8080,()=>{
    console.log("Listening on port 8080");
});