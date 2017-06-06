const express=require("express");
const mysql=require("mysql");
const pathLib=require("path");
const fs=require("fs");
module.exports=function(){
	var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learner"});
	var router=express.Router();
		router.get("/",(req,res)=>{
			var act=req.query.act;
			var id=req.query.id;
			switch(act){
				case "del":
				db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${id}`,(err,data)=>{
					if(err){
						res.status("500").send("database err").end();
					}else{
						fs.unlink("static/upload/"+data[0].src,(err)=>{
							if(err){
								console.log(err);
								res.status("404").send("file delete err").end();
							}else{
								db.query(`DELETE FROM custom_evaluation_table WHERE ID=${id}`,(err,data)=>{
									if(err){
											res.status("500").send("database err").end();
										}else{
											res.redirect("/admin/custom");
										}
								});
							}
						})
					}
				})

				break;
				case "mod":
				db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${id}`,(err,data)=>{  //获取修改的数据
					if(err){
						res.status("500").send("database err").end();
					}else if(data.length==0){
						res.status("404").send("no id").end();
					}
					else{
						db.query("SELECT * FROM custom_evaluation_table",(err,banner)=>{    //获取表格数据
							if(err){
								res.status("500").send("database err").end();
							}else{
								res.render("admin/custom.ejs",{banner,mod_data:data[0]});
							}
						})
					}
				})
				break;
				default:
					db.query("SELECT * FROM custom_evaluation_table",(err,banner)=>{
						if(err){
							res.status("500").send("database err").end();
						}else{
							res.render("admin/custom.ejs",{banner});
						}
					})
			}
			
			
		})
		router.post("/",(req,res)=>{   //插入内容
			var title=req.body.title;
			var description=req.body.description;
			var mod_id=req.body.mod_id;
			if(req.files[0]){     	
				var ext=pathLib.parse(req.files[0].originalname).ext;
				var newFileName=req.files[0].filename+ext;
				var odlPath=req.files[0].path;
				var newPath=req.files[0].path+ext;	
			}else{
				var newFileName=null;      
			}
			

			if(mod_id){ //修改
				if(newFileName==null){    //修改其他两项
					db.query(`UPDATE custom_evaluation_table SET title="${title}",description="${description}" WHERE ID=${mod_id}`,(err,data)=>{
						if(err){
							console.log(err);
							res.status(500).send("database err").end();
						}else{
							res.redirect("/admin/custom");
						}
					})
				}else{     //修改三项
					db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${mod_id}`,(err,data)=>{   //查询src
						if(err){
							console.log(err);
							res.status(500).send("database err").end();
						}else{
							fs.unlink("./static/upload/"+data[0].src,(err)=>{   //删除文件
								if(err){
									console.log(err);
									res.status(404).send("no file").end();
								}else{
									fs.rename(odlPath,newPath,(err)=>{       //更改路径
										if(err){
											res.status(500).send("file err").end();
										}else{  
											db.query(`UPDATE custom_evaluation_table SET title="${title}",description="${description}",src="${newFileName}" WHERE ID=${mod_id}`,
											(err,data)=>{
												if(err){
													console.log(err);
													res.status(500).send("database err").end();
												}else{
													res.redirect("/admin/custom");
												}
											})
										}
									})	
								}
							})
						}
					})
				}

			}else{ //新增
				fs.rename(odlPath,newPath,(err)=>{
					if(err){
						res.status(500).send("file err").end();
					}else{
							db.query(`INSERT INTO custom_evaluation_table (title,description,src)
								VALUES ("${title}","${description}","${newFileName}")`,(err,data)=>{
									if(err){
										console.log(err);
										res.status("500").send("database err").end();
									}else{
										console.log(1);
										res.redirect("/admin/custom");
									}
								});
					}
				})

			}
		})
	return router;
};