var bodyParser = require('body-parser'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
 express = require('express'),
app = express();

mongoose.connect("mongodb://localhost/wdbBlogApp");

app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title : String,
	image: String,
	post: String,
	created: {type: Date, default:Date.now}
});

var Blog = mongoose.model('Blog',blogSchema);

/*Blog.create({title: "Blog1",
			 image: "https://images.unsplash.com/photo-1466814314367-45323ac74e2b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8c6acc770fb2a1c12fef43fce554b088&auto=format&fit=crop&w=1622&q=80",
			 post : "food is life"
			},function(err,newBlog){
				if(err){
					console.log(err);
				}else{
					console.log('Blog created');
				}

			});
*/

//Routes
app.get('/blogs',function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			//console.log(blogs);
			res.render("index",{blogs : blogs});
		}

	})
});
app.get('/blogs/new',function(req,res){
	res.render("new");
});

//create route
app.post('/blogs',function(req,res){

	Blog.create(req.body.blog,function(err,newBlog){
				if(err){
					console.log(err);
					res.render("new");
				}else{
					res.redirect("/blogs");
					console.log('Blog created');
				}

			});

});

//Show
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			console.log(foundBlog);
			res.render('Blog',{blog: foundBlog});
		}
	});
});

//edit
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			console.log(foundBlog);
			res.render('edit',{blog: foundBlog});
		}
	});
});

//update
app.put('/blogs/:id',function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			
			res.redirect("/blogs/"+ req.params.id);
		}
	});


});

//Delete

app.delete('/blogs/:id',function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			
			res.redirect("/blogs");
		}
	});

//res.send("delete");
});


app.listen(3000,function(){
	console.log("Running at port 3000");
})