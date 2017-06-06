const express=require("express");
const mysql=require("mysql");
module.exports=function(){
	var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learner"});
	var router=express.Router();
		router.get("/",(req,res)=>{
			var act=req.query.act;
			var id=req.query.id;
			switch(act){
				case "mod":
					
					db.query(`SELECT * FROM banner_table WHERE ID=${id}`,(err,data)=>{
						if(err){
							res.status(500).send("database iscorrect").end();
						}else if(data.length==0){
							res.status(400).send("no id").end();
						}else{
							db.query("SELECT * FROM banner_table",(err,banner)=>{
								if(err){
									res.status("500").send("database err").end();
								}else{
									res.render("admin/banner.ejs",{banner:banner,mod_data:data[0]});
								}
							})
						}
					})
					break;
				case "del":
					db.query(`DELETE FROM banner_table WHERE ID=${id} `,(err,data)=>{
						if(err){
							res.status(500).send("database iscorrect").end();
						}else{
							res.redirect("/admin/banner");
						}
					})
					break;
				default:
					db.query("SELECT * FROM banner_table",(err,data)=>{
						if(err){
							res.status("500").send("database err").end();
						}else{
							res.render("admin/banner.ejs",{banner:data});
						}
					})
			}
		})
		router.post("/",(req,res)=>{   //插入内容
			var title=req.body.title;
			var description=req.body.description;
			var href=req.body.href;
			var mod_id=req.body.mod_id;
			if(mod_id){                         //修改
				db.query(`UPDATE banner_table SET title="${title}",description="${description}",href="${href}" 
					WHERE ID=${mod_id}`,(err,data)=>{
					if(err){
						res.status(500).send("database err").end();
					}else{
						res.redirect("/admin/banner")
					}
				});
			}else{                     //插入
				if(!title||!description||!href){
					res.status("400").send("arguments iscorrect");
					console.log("参数有误");
				}else{
					db.query(`INSERT INTO banner_table (title,description,href)
					 VALUES ("${title}","${description}","${href}")`,(err,data)=>{
						if(err){
							res.status(500).send("database err").end();
						}else{
							res.redirect("/admin/banner")
						}
					});
				}
			}
			

		})
	return router;
};