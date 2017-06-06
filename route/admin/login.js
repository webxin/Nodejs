const express=require("express");
const common=require("../../libs/common");
const mysql=require("mysql");
module.exports=function(){
	var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learner"});
	var router=express.Router();
	router.get("/",(req,res)=>{
		res.render("admin/login.ejs",{});
	})

	router.post("/",(req,res)=>{
		var username=req.body.username;
		var password=common.md5(req.body.password+common.md5_fix);
		db.query(`SELECT * FROM admin_table WHERE username="${username}"`,(err,data)=>{
			if(err){
				res.status(500).send("服务器出错了");
			}else{
				if(data.length==0){
					res.send("no admin exsit");
				}else{
					if(data[0].password==password){
						req.session["admin_id"]=data[0].ID;
						res.redirect("/admin");
						console.log("密码正确");
					}else{
						console.log("密码有错");
					}
				}	
			}
			
		})
	})
	return router;
};
