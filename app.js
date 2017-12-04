var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/Knownager");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));


var courseSchema = new mongoose.Schema({
	name:String,
	description: String,
});
var course = mongoose.model("course", courseSchema);

app.get("/", function(req, res){
	res.redirect("/knownager");
});
app.get("/knownager", function(req, res){
	course.find({},function(err, courses){
		if(err){
			console.log(err);
		}else{
			res.render("courses", {courses: courses});
		}
	})
});
app.post("/knownager", function(req, res){
	var name = req.body.name;
	var desc = req.body.description;
	var newcourse = {name: name, description: desc,};
	course.create(newcourse, function(err, newlyCreated){
   		if(err){
   			console.log(err);
   		}else{
   			res.redirect("/knownager");
   		}
   });
});
app.get("/knownager/new", function(req, res){
	res.render("new");
});
app.listen(5000, function(){
	console.log("Knownager server running!");
});