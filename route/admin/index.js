const express=require("express");
const common=require("../../libs/common");
const mysql=require("mysql");
module.exports=function(){
	var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learner"});
	var router=express.Router();
	router.use((req,res,next)=>{
		if(!req.session["admin_id"]&&req.url!="/login"){
			res.redirect("/admin/login");
		}else{
			next();
		}
	})
	/*router.get("/",(req,res)=>{
		res.render("admin/index.ejs",{});
	})*/
	router.use("/",require("./banner")());
	/*router.use("/banner",require("./banner")());*/
	router.use("/login",require("./login")());
	router.use("/custom",require("./custom")());
	router.use("/aboutus",require("./aboutus")());
	router.use("/blog",require("./blog")());
	router.use("/contact",require("./contact")());
	router.use("/msg",require("./msg")());
	router.use("/news",require("./news")());
	return router;
}
