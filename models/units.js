var mongoose = require("mongoose");

var unitSchema = new mongoose.Schema({
	courseId:String,
	name:String,
	text:String,
});
module.exports = mongoose.model("Unit", unitSchema);