var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Course = require("./models/courses");
var Unit   = require("./models/units");
var seedDB     = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");


// seedDB();

//mongoose.connect("mongodb://localhost/Knownager");
mongoose.connect("mongodb://jinhao:yang@ds033196.mlab.com:33196/knownager");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"secretcode",
    resave:false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
	// res.redirect("/courses");
	if(req.isAuthenticated()){
      return res.redirect("/courses");
    }
	res.render("homepage");
});
app.get("/courses", isLoggedIn, function(req, res){

	Course.find({username: req.user.username},function(err, courses){
	 	if(err){
	 		console.log(err);
	 	}else{
	 		res.render("courses/courses", {courses: courses});
	 	}
	 })
});
app.post("/courses", isLoggedIn,function(req, res){
	var name = req.body.name;
	var desc = req.body.description;
	var username = req.user.username;
	var newcourse = {name: name, description: desc, username: username};
	Course.create(newcourse, function(err, newlyCreated){
   		if(err){
   			console.log(err);
   		}else{
   			res.redirect("/courses");
   		}
   });
});
app.get("/courses/new", isLoggedIn, function(req, res){
	res.render("courses/new");
});
app.get("/courses/units/:id", isLoggedIn, function(req, res){
	 Course.findById(req.params.id).populate("units").exec(function(err,foundcourse){
	     if(err){
	       console.log(err);
	     }else{
	       res.render("units/show", {course: foundcourse});
	     }
	 });
});
app.get("/courses/units/:id/new", isLoggedIn, function(req, res){
	Course.findById(req.params.id, function(err, course){
        if(err){
        	console.log(err);
        }
        else{
        	res.render("units/new", {course: course});
        }
    });
});
app.post("/courses/units/:id", isLoggedIn, function(req, res){
	Course.findById(req.params.id, function(err, course){
		if(err){
			console.log(err);
		}
		else{
			Unit.create(req.body.unit, function(err, unit){
	            if(err){
		            console.log(err);
	            }
	            else{
	            	unit.courseId = course._id;
	            	unit.save();
	                course.units.push(unit);
	    	        course.save();
	                res.redirect('/courses/units/' + course._id);
	            }
          	})
		}
	})
});
//===========
//auth routes
//===========
//show register form
app.get("/register",function(req, res){
    res.render("register");
});
//handle signup logic
app.post("/register", function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      }
      passport.authenticate("local")(req,res,function(){
          res.redirect("/courses");
      });
    });
});
//show login form
app.get("/login", function(req, res){
  res.render("login");
});
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
  {
    successRedirect:"/courses",
    failureRedirect:"/login",
  }),function(req, res){
});
//logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/courses");
});
function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}
//update
app.get("/courses/:id/edit", isLoggedIn, function(req, res){
    Course.findById(req.params.id, function(err,foundCourse){
      if(err){
        return console.log(err);
      }
     res.render("courses/edit",{course:foundCourse});
    });    
});
app.put("/courses/:id",  isLoggedIn, function(req, res){
    //find and output the correct campground and redirect somewhere
    console.log("edit form reaches");
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, updatedCourse){
        if(err){
          res.redirect("/courses");
        }
        else{
          res.redirect("/courses");
        }
    });
});
//destory route
app.delete("/courses/:id", isLoggedIn, function(req, res){
    Course.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/courses");
      }
      else{
        res.redirect("/courses")
      }
    })
});
//units update
app.get("/courses/units/:id/edit", isLoggedIn, function(req, res){
	
    Unit.findById(req.params.id, function(err,foundUnit){
    	
    if(err){
         return console.log(err);
       }
      
      res.render("units/edit",{unit:foundUnit});
     });    
});
app.put("/courses/units/:id", isLoggedIn, function(req, res){
    //find and output the correct course and redirect somewhere
    Unit.findByIdAndUpdate(req.params.id, req.body.unit, function(err, updatedUnit){
        if(err){
          res.redirect("/courses");
        }
        else{
          res.redirect("/courses/units/" + updatedUnit.courseId);
        }
    });
});
//destory unit
app.delete("/courses/units/:id", isLoggedIn, function(req, res){
	var parentCourseId;
	Unit.findById(req.params.id,function(err ,foundUnit){
		if(err){
			console.log(err);
		}else{
			parentCourseId = foundUnit.courseId;
		}
	});
    Unit.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/courses");
      }
      else{
        res.redirect("/courses/units/" + parentCourseId);
      }
    })
});
// app.get("/courses/units/:id/:id",isLoggedIn, function(req,res){
// 	Unit.findById(req.params.id, function(err,foundUnit){
// 	    if(err){
// 	        console.log(err);
// 	    }else{
// 	        res.render("unitText/show", {unit: foundUnit});
// 	    }
// 	});
// })
app.listen(process.env.PORT, process.env.IP);