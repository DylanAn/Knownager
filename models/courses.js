var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
	name:String,
	description: String,
	username:String,
	units:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref: "Unit"
		}
	]
});
module.exports = mongoose.model("Course", courseSchema);