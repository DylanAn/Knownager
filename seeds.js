var mongoose = require("mongoose");
var Course = require("./models/courses");
var Unit  = 	 require("./models/units");
var data = [
	{
		name:"CS251",
		description:"Fall 2017 cs251 algorithm"
	},
	{
		name:"CS252",
		description:"Fall 2017 cs252 operating system"
	},
	{
		name:"MA353",
		description:"Fall 2017 ma353 linear algebra"
	}
]
var data2 = [
	{
		name:"Unit 1",
		text:"first lecture unit 1 blah blah blah"
	},
	{
		name:"Unit 2",
		text:"syllabus blah blah blah"
	},
	{
		name:"lecture 3",
		text:"homework 1 due blah blah blah"
	}
]
function seedDB(){
	//remove all campgrounds
	Course.remove({},function(err){
		Unit.remove({}, function(err){

		});
		// if(err){
		// 	console.log(err);
		// }
		// console.log("removed course");
		// Unit.remove({}, function(err){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// 	data.forEach(function(seed){
		// 		Course.create(seed, function(err, course){
		// 			if(err){
		// 					console.log(err);
		// 			}
		// 			else{
		// 				console.log("added course");
		// 				data2.forEach(function(unit){
		// 					Unit.create(unit, function(err, createdunit){
		// 						if(err){
		// 							console.log(err);
		// 						}
		// 						else{
		// 							course.units.push(createdunit);
		// 							course.save();
		// 							console.log("added unit");
		// 						}
		// 					})
		// 				})
		// 			}
		// 		});
		// 	});
		// })		
	});
	//add a few campgrounds
}

module.exports = seedDB;

